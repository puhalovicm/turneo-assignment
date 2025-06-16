'use client'

import { useQuery } from '@tanstack/react-query'
import { getExperiences, getExperienceById } from '@/lib/actions/experiences'

export const experienceKeys = {
  all: ['experiences'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (params?: Parameters<typeof getExperiences>[0]) => [...experienceKeys.lists(), params] as const,
  details: () => [...experienceKeys.all, 'detail'] as const,
  detail: (id: string) => [...experienceKeys.details(), id] as const,
}

export function useExperiences(params?: Parameters<typeof getExperiences>[0]) {
  return useQuery({
    queryKey: experienceKeys.list(params),
    queryFn: () => getExperiences(params),
    enabled: true,
  })
}

export function useExperience(experienceId: string) {
  return useQuery({
    queryKey: experienceKeys.detail(experienceId),
    queryFn: () => getExperienceById(experienceId),
    enabled: !!experienceId,
  })
} 