'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getOrderById, 
  createNewOrder, 
  addBooking, 
  removeBooking, 
  confirmOrderAction 
} from '@/lib/actions/orders'
import type { TurneoOrderRequest, TurneoBookingData, TurneoOrderResponse } from '@/lib/turneo-api'

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}

export function useOrder(orderId: string, options?: { initialData?: TurneoOrderResponse }) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    initialData: options?.initialData,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (orderData: TurneoOrderRequest) => createNewOrder(orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      
      if ('id' in data) {
        queryClient.setQueryData(orderKeys.detail(data.id), data)
      }
    },
  })
}

export function useAddBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderId, bookingData }: { orderId: string; bookingData: TurneoBookingData }) =>
      addBooking(orderId, bookingData),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(orderKeys.detail(variables.orderId), data)
    },
  })
}

export function useRemoveBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderId, bookingIds }: { orderId: string; bookingIds: string[] }) =>
      removeBooking(orderId, bookingIds),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(orderKeys.detail(variables.orderId), data)
    },
  })
}

export function useConfirmOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderRequest, orderId }: { orderRequest: TurneoOrderRequest; orderId: string }) => 
      confirmOrderAction(orderRequest, orderId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(orderKeys.detail(variables.orderId), data)
    },
  })
} 