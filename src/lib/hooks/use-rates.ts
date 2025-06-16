'use client'

import { useQuery } from '@tanstack/react-query'
import { getRates, getRateById } from '@/lib/actions/rates'

export const rateKeys = {
  all: ['rates'] as const,
  lists: () => [...rateKeys.all, 'list'] as const,
  list: (params?: Parameters<typeof getRates>[0]) => [...rateKeys.lists(), params] as const,
  details: () => [...rateKeys.all, 'detail'] as const,
  detail: (id: string, experienceId: string) => [...rateKeys.details(), id, experienceId] as const,
}

export function useRates(params?: Parameters<typeof getRates>[0]) {
  return useQuery({
    queryKey: rateKeys.list(params),
    queryFn: () => getRates(params),
    enabled: !!params?.experienceId,
  })
}

export function useRate(rateId: string, experienceId: string) {
  return useQuery({
    queryKey: rateKeys.detail(rateId, experienceId),
    queryFn: () => getRateById(rateId, experienceId),
    enabled: !!rateId && !!experienceId,
  })
} 