'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExperiences, useRates, useCreateOrder, useRate } from '@/lib/hooks';
import { TurneoOrderRequest, TurneoRate, TurneoRatesPaginatedResponse, TurneoApiError, TurneoExperience } from '@/lib/turneo-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

interface ExperienceBookingClientProps {
  experienceId: string;
  experience: TurneoExperience;
  partnerId: string;
}

interface BookingFormData {
  travelerInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  selectedAvailability: {
    availabilityId: string;
    rateId: string;
    rateType: 'Adult' | 'Child' | 'Infant';
    quantity: number;
    localTime: string;
  } | null;
  selectedMeetingPoint: {
    id: string;
    type: string;
    address: string;
    description?: string;
  } | null;
  privateRequested: boolean;
  startingTime: string;
  quantities: {
    adults: number;
    children: number;
    infants: number;
  };
  notes: {
    fromTraveler: string;
  };
}

const initialBookingForm: BookingFormData = {
  travelerInformation: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  selectedAvailability: null,
  selectedMeetingPoint: null,
  privateRequested: false,
  startingTime: '',
  quantities: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  notes: {
    fromTraveler: '',
  },
};

export default function ExperienceBookingClient({ experienceId, experience, partnerId }: ExperienceBookingClientProps) {
  const router = useRouter();
  const [bookingForm, setBookingForm] = useState<BookingFormData>(initialBookingForm);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedRate, setSelectedRate] = useState<TurneoRate | null>(null);

  const { isLoading: experienceLoading } = useExperiences();
  const { data: rates, isLoading: ratesLoading, error: ratesError } = useRates(
    dateRange.from && dateRange.to
      ? { 
          experienceId, 
          validFrom: format(dateRange.from, 'yyyy-MM-dd'), 
          validTo: format(dateRange.to, 'yyyy-MM-dd') 
        }
      : dateRange.from
      ? { 
          experienceId, 
          validFrom: format(dateRange.from, 'yyyy-MM-dd'), 
          validTo: format(dateRange.from, 'yyyy-MM-dd') 
        }
      : { experienceId }
  );
  
  const { data: detailedRate, isLoading: detailedRateLoading } = useRate(
    selectedRate?.id || '',
    experienceId
  );
  
  const createOrderMutation = useCreateOrder();

  const handleInputChange = (field: keyof BookingFormData['travelerInformation'], value: string) => {
    setBookingForm(prev => ({
      ...prev,
      travelerInformation: {
        ...prev.travelerInformation,
        [field]: value,
      },
    }));
  };

  const handleQuantityChange = (type: keyof BookingFormData['quantities'], value: number) => {
    setBookingForm(prev => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [type]: Math.max(0, value),
      },
    }));
  };

  const handleNotesChange = (value: string) => {
    setBookingForm(prev => ({
      ...prev,
      notes: {
        fromTraveler: value,
      },
    }));
  };

  const handleMeetingPointSelection = (meetingPoint: {
    id: string;
    type: string;
    address: string;
    description?: string;
  }) => {
    setBookingForm(prev => ({
      ...prev,
      selectedMeetingPoint: meetingPoint,
    }));
  };

  const handleRateSelection = (rate: TurneoRate) => {
    setSelectedRate(rate);
    setBookingForm(prev => ({
      ...prev,
      selectedAvailability: null,
    }));
  };

  const handlePrivateGroupToggle = (value: boolean) => {
    setBookingForm(prev => ({
      ...prev,
      privateRequested: value,
      startingTime: value ? prev.startingTime : '',
    }));
  };

  const handleStartingTimeChange = (value: string) => {
    setBookingForm(prev => ({
      ...prev,
      startingTime: value,
    }));
  };

  const handleCreateBooking = async () => {
    const { firstName, lastName, email, phone } = bookingForm.travelerInformation;
    const { adults, children, infants } = bookingForm.quantities;

    if (!bookingForm.selectedAvailability) {
      console.log('No availability selected, showing alert');
      alert('Please select an availability');
      return;
    }

    if (!firstName || !lastName || !email || !phone) {
      console.log('Missing required fields');
      alert('Please fill in all required fields (First Name, Last Name, Email, Phone)');
      return;
    }

    if (adults === 0 && children === 0 && infants === 0) {
      console.log('No participants selected');
      alert('Please select at least one participant');
      return;
    }

    if (experience.meetingPoints && experience.meetingPoints.length > 0 && !bookingForm.selectedMeetingPoint) {
      alert('Please select a meeting point');
      return;
    }

    if (bookingForm.privateRequested && !bookingForm.startingTime) {
      alert('Please select a starting time for your private group.');
      return;
    }

    const ratesQuantity: { rateType: 'Adult' | 'Child' | 'Infant'; quantity: number }[] = [];
    if (adults > 0) ratesQuantity.push({ rateType: 'Adult', quantity: adults });
    if (children > 0) ratesQuantity.push({ rateType: 'Child', quantity: children });
    if (infants > 0) ratesQuantity.push({ rateType: 'Infant', quantity: infants });

    const orderRequest: TurneoOrderRequest = {
      travelerInformation: {
        firstName,
        lastName,
        email,
        phone,
      },
      bookings: [
        {
          availabilityId: bookingForm.selectedAvailability.availabilityId,
          rateId: bookingForm.selectedAvailability.rateId,
          ratesQuantity: ratesQuantity,
          reseller: {
            name: 'Turneo Assignment App',
            partnerId,
          },
          additionalInformation: {},
          notes: {
            fromTraveler: bookingForm.notes.fromTraveler,
          },
          meetingPoint: bookingForm.selectedMeetingPoint ? {
            type: bookingForm.selectedMeetingPoint.type as 'CENTRAL_MEETING_POINT' | 'HOTEL_PICKUP',
            address: bookingForm.selectedMeetingPoint.address,
            description: bookingForm.selectedMeetingPoint.description,
          } : undefined,
          privateGroup: {
            privateRequested: bookingForm.privateRequested,
            startingTime: bookingForm.privateRequested && bookingForm.startingTime
              ? bookingForm.startingTime
              : undefined,
          },
          travelerInformation: {
            firstName,
            lastName,
            email,
            phone,
          },
        },
      ],
    };

    try {
      const result = await createOrderMutation.mutateAsync(orderRequest);      
      if ('id' in result) {
        // Redirect to order details page
        router.push(`/orders/${result.id}`);
      } else {
        console.log('Order creation failed:', result);
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  function isRatesResponse(data: TurneoRatesPaginatedResponse | TurneoApiError | undefined): data is TurneoRatesPaginatedResponse {
    return !!data && 'results' in data && Array.isArray(data.results);
  }

  const handleSelectAvailability = (rate: TurneoRate, availability: { availabilityId: string; localTime?: string; time?: string; availableQuantity: number }, rateType: 'Adult' | 'Child' | 'Infant') => {
    setBookingForm(prev => {
      const newForm = {
        ...prev,
        selectedAvailability: {
          availabilityId: availability.availabilityId,
          rateId: rate.id,
          rateType,
          quantity: 1,
          localTime: availability.localTime || availability.time || '',
        },
      };
      return newForm;
    });
  };

  if (experienceLoading || ratesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  const error = ratesError ? 'Failed to fetch rates.' : null;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select Date Range</Label>
          <Calendar
            mode="range"
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              setDateRange({
                from: range?.from,
                to: range?.to,
              });
            }}
            fromDate={new Date()}
            className="mt-2"
          />
          {dateRange.from && (
            <div className="mt-2 text-sm text-gray-600">
              {dateRange.to ? (
                <>
                  Selected: {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                </>
              ) : (
                <>
                  Selected: {format(dateRange.from, 'MMM dd, yyyy')}
                </>
              )}
            </div>
          )}
        </div>

        {dateRange.from && isRatesResponse(rates) && rates.results.length > 0 && (
          <div>
            <Label>Select Rate</Label>
            <div className="space-y-2 mt-2">
              {rates.results.map((rate: TurneoRate) => (
                <div key={rate.id} className="flex items-center gap-4 border rounded p-2">
                  <div>
                    <div className="font-medium">{rate.rateName}</div>
                    <div className="text-xs text-gray-500">{rate.description || 'No description'}</div>
                    <div className="text-xs text-gray-500">Rate Code: {rate.rateCode}</div>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedRate?.id === rate.id ? 'default' : 'outline'}
                    onClick={() => handleRateSelection(rate)}
                  >
                    {selectedRate?.id === rate.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedRate && detailedRate && !('success' in detailedRate) && detailedRate.availableDates && detailedRate.availableDates.length > 0 && (
          <div>
            <Label>Available Slots</Label>
            <div className="space-y-2 mt-2">
              {detailedRate.availableDates.map((availability) => {
                const validRateType = (detailedRate.rateTypesPrices?.[0]?.rateType === 'Adult' || detailedRate.rateTypesPrices?.[0]?.rateType === 'Child' || detailedRate.rateTypesPrices?.[0]?.rateType === 'Infant')
                  ? detailedRate.rateTypesPrices[0].rateType as 'Adult' | 'Child' | 'Infant'
                  : 'Adult';
                
                return (
                  <div key={availability.availabilityId} className="flex items-center gap-4 border rounded p-2">
                    <div>
                      <div className="font-medium">{detailedRate.rateName}</div>
                      <div className="text-xs text-gray-500">{availability.localTime || availability.time}</div>
                      <div className="text-xs text-gray-500">Available: {availability.availableQuantity}</div>
                      <div className="text-xs text-gray-500">Status: {availability.availabilityStatus}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={
                        bookingForm.selectedAvailability?.availabilityId === availability.availabilityId &&
                        bookingForm.selectedAvailability?.rateId === detailedRate.id
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleSelectAvailability(detailedRate, {
                        availabilityId: availability.availabilityId,
                        localTime: availability.localTime || availability.time,
                        time: availability.time,
                        availableQuantity: availability.availableQuantity,
                      }, validRateType)}
                      disabled={availability.availabilityStatus !== 'SELLING'}
                    >
                      {bookingForm.selectedAvailability?.availabilityId === availability.availabilityId &&
                      bookingForm.selectedAvailability?.rateId === detailedRate.id
                        ? 'Selected'
                        : availability.availabilityStatus === 'SELLING'
                        ? 'Select'
                        : availability.availabilityStatus}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedRate && detailedRateLoading && (
          <div className="text-gray-500 text-sm">Loading availability...</div>
        )}

        {selectedRate && detailedRate && !('success' in detailedRate) && (!detailedRate.availableDates || detailedRate.availableDates.length === 0) && (
          <div className="text-gray-500 text-sm">No availabilities for this rate.</div>
        )}

        {experience.meetingPoints && experience.meetingPoints.length > 0 && (
          <div>
            <Label>Select Meeting Point *</Label>
            <div className="space-y-2 mt-2">
              {experience.meetingPoints.map((meetingPoint) => (
                <div key={meetingPoint.id} className="flex items-center gap-4 border rounded p-3">
                  <div className="flex-1">
                    <div className="font-medium">{meetingPoint.title}</div>
                    <div className="text-sm text-gray-600">{meetingPoint.description}</div>
                    <div className="text-xs text-gray-500">{meetingPoint.address}</div>
                    <div className="text-xs text-gray-500">{meetingPoint.city}, {meetingPoint.country}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      meetingPoint.type === 'CENTRAL_MEETING_POINT' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {meetingPoint.type === 'CENTRAL_MEETING_POINT' ? 'Central' : 'Pickup'}
                    </span>
                    <Button
                      size="sm"
                      variant={bookingForm.selectedMeetingPoint?.id === meetingPoint.id ? 'default' : 'outline'}
                      onClick={() => handleMeetingPointSelection({
                        id: meetingPoint.id,
                        type: meetingPoint.type,
                        address: meetingPoint.address,
                        description: meetingPoint.description,
                      })}
                    >
                      {bookingForm.selectedMeetingPoint?.id === meetingPoint.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {!bookingForm.selectedMeetingPoint && (
              <p className="text-sm text-red-600 mt-1">Please select a meeting point</p>
            )}
          </div>
        )}

        {selectedRate && experience.tags?.private !== 'NO' && (
          <div className="flex items-center gap-4">
            <Switch
              id="privateGroup"
              checked={bookingForm.privateRequested}
              onCheckedChange={handlePrivateGroupToggle}
            />
            <Label htmlFor="privateGroup">Request Private Group</Label>
          </div>
        )}

        {selectedRate && 
         bookingForm.privateRequested && 
         experience.tags?.private !== 'NO' && 
         selectedRate.openingTimes && (
          <div>
            <Label htmlFor="startingTime">Starting Time</Label>
            <Input
              id="startingTime"
              type="time"
              value={bookingForm.startingTime}
              min={selectedRate.openingTimes.fromTime}
              max={selectedRate.openingTimes.toTime}
              step="60"
              onChange={e => handleStartingTimeChange(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">
              Allowed: {selectedRate.openingTimes.fromTime} - {selectedRate.openingTimes.toTime}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={bookingForm.travelerInformation.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={bookingForm.travelerInformation.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={bookingForm.travelerInformation.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={bookingForm.travelerInformation.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Number of Participants</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="adults">Adults</Label>
              <Input
                id="adults"
                type="number"
                min="0"
                value={bookingForm.quantities.adults}
                onChange={(e) => handleQuantityChange('adults', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                min="0"
                value={bookingForm.quantities.children}
                onChange={(e) => handleQuantityChange('children', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="infants">Infants</Label>
              <Input
                id="infants"
                type="number"
                min="0"
                value={bookingForm.quantities.infants}
                onChange={(e) => handleQuantityChange('infants', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Special Requests</Label>
          <Textarea
            id="notes"
            value={bookingForm.notes.fromTraveler}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Any special requests or notes..."
            rows={3}
          />
        </div>

        <Button
          onClick={() => {
            handleCreateBooking();
          }}
          disabled={createOrderMutation.isPending}
          className="w-full"
        >
          {createOrderMutation.isPending ? 'Creating Booking...' : 'Book Now'}
        </Button>
      </CardContent>
    </Card>
  );
} 