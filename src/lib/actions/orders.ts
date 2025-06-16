'use server'

import { 
  createOrder, 
  fetchOrderById,
  addBookingToOrder,
  removeBookingFromOrder,
  confirmOrder,
  type TurneoOrderRequest, 
  type TurneoOrderResponse, 
  type TurneoBookingData,
  type TurneoApiError 
} from '../turneo-api'

export async function createNewOrder(orderData: TurneoOrderRequest): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    return await createOrder(orderData)
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getOrderById(orderId: string): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    return await fetchOrderById(orderId)
  } catch (error) {
    console.error('Error fetching order:', error)
    return {
      success: false,
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function addBooking(orderId: string, bookingData: TurneoBookingData): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    return await addBookingToOrder(orderId, bookingData)
  } catch (error) {
    console.error('Error adding booking:', error)
    return {
      success: false,
      message: 'Failed to add booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function removeBooking(orderId: string, bookingIds: string[]): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    return await removeBookingFromOrder(orderId, bookingIds)
  } catch (error) {
    console.error('Error removing booking:', error)
    return {
      success: false,
      message: 'Failed to remove booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function confirmOrderAction(orderRequest: TurneoOrderRequest, orderId: string): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    return await confirmOrder(orderRequest, orderId)
  } catch (error) {
    console.error('Error confirming order:', error)
    return {
      success: false,
      message: 'Failed to confirm order',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 