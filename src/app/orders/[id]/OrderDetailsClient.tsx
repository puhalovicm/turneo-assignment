"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TurneoOrderResponse } from '@/lib/turneo-api';
import { useOrder, useRemoveBooking, useConfirmOrder } from '@/lib/hooks/use-orders';
import { APP_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderDetailsClientProps {
  order: TurneoOrderResponse;
}

export default function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  const orderId = order.id;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmSuccess, setShowConfirmSuccess] = useState(false);
  const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
  
  const { 
    data: currentOrder, 
    isLoading, 
    error, 
    refetch 
  } = useOrder(orderId, { initialData: order });
  
  const removeBookingMutation = useRemoveBooking();
  const confirmOrderMutation = useConfirmOrder();

  const displayOrder = currentOrder && 'id' in currentOrder ? currentOrder : order;
  const isError = error || (currentOrder && 'success' in currentOrder && !currentOrder.success);

  useEffect(() => {
    if (confirmOrderMutation.isSuccess) {
      setShowConfirmSuccess(true);
      const timer = setTimeout(() => {
        setShowConfirmSuccess(false);
      }, APP_CONFIG.UI.SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [confirmOrderMutation.isSuccess]);

  useEffect(() => {
    if (removeBookingMutation.isSuccess) {
      setShowRemoveSuccess(true);
      const timer = setTimeout(() => {
        setShowRemoveSuccess(false);
      }, APP_CONFIG.UI.SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [removeBookingMutation.isSuccess]);

  const handleRemoveBookings = async (bookingIds: string[]) => {
    removeBookingMutation.mutate({ orderId, bookingIds });
  };

  const handleConfirmOrder = async () => {

    const orderRequest = {
      travelerInformation: displayOrder.travelerInformation,
      bookings: displayOrder.bookings.map(booking => ({
        id: booking.id,
        availabilityId: booking.availabilityId,
        rateId: booking.rateId,
        ratesQuantity: booking.ratesQuantity,
        reseller: booking.reseller,
        travelerInformation: booking.travelerInformation,
        additionalInformation: booking.additionalInformation || {},
        notes: booking.notes,
        resellerReference: booking.resellerReference,
        meetingPoint: booking.meetingPoint,
      }))
    };
    
    confirmOrderMutation.mutate({ orderRequest, orderId });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Experiences
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">Order Details</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                variant="outline"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              {(displayOrder.status === 'PENDING' || displayOrder.status === 'ON_HOLD') && (
                <Button
                  onClick={handleConfirmOrder}
                  disabled={isLoading || confirmOrderMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {confirmOrderMutation.isPending ? 'Confirming...' : 'Confirm Order'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-700">
                  <strong>Error:</strong> {error?.message || (currentOrder && 'success' in currentOrder ? currentOrder.message : 'Unknown error')}
                </p>
              </CardContent>
            </Card>
          )}

          {showConfirmSuccess && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-green-700">
                  <strong>Success:</strong> Order confirmed successfully!
                </p>
              </CardContent>
            </Card>
          )}

          {showRemoveSuccess && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-green-700">
                  <strong>Success:</strong> Booking removed successfully!
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><span className="font-medium">Order ID:</span> {displayOrder.id}</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                        displayOrder.status === 'BOOKED' ? 'bg-green-100 text-green-800' :
                        displayOrder.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        displayOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {displayOrder.status}
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Traveler Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><span className="font-medium">Name:</span> {displayOrder.travelerInformation.firstName} {displayOrder.travelerInformation.lastName}</p>
                    <p><span className="font-medium">Email:</span> {displayOrder.travelerInformation.email}</p>
                    <p><span className="font-medium">Phone:</span> {displayOrder.travelerInformation.phone}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Bookings</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {displayOrder.bookings && displayOrder.bookings.length > 0 ? (
                    <div className="space-y-4">
                      {displayOrder.bookings.map((booking, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">Booking {index + 1}</h4>
                                <p className="text-sm text-gray-600">Availability ID: {booking.availabilityId}</p>
                                {booking.ratesQuantity && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">Rates:</p>
                                    <ul className="text-sm text-gray-600">
                                      {booking.ratesQuantity.map((rate, rateIndex) => (
                                        <li key={rateIndex}>
                                          {rate.rateType}: {rate.quantity}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              {displayOrder.status !== 'BOOKED' && displayOrder.status !== 'COMPLETED' && (
                                <Button
                                  onClick={() => handleRemoveBookings([booking.id || ''])}
                                  disabled={removeBookingMutation.isPending}
                                  variant="destructive"
                                  size="sm"
                                >
                                  {removeBookingMutation.isPending ? 'Removing...' : 'Remove'}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No bookings found.</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 