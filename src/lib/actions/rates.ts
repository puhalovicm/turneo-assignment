'use server'

import { 
  fetchRates, 
  fetchRateById,
  type TurneoRatesPaginatedResponse, 
  type TurneoRate, 
  type TurneoApiError 
} from '../turneo-api'

export async function getRates(params?: {
  experienceId?: string
  validFrom?: string
  validTo?: string
  page?: number
}): Promise<TurneoRatesPaginatedResponse | TurneoApiError> {
  try {
    return await fetchRates(params)
  } catch (error) {
    console.error('Error fetching rates:', error)
    return {
      success: false,
      message: 'Failed to fetch rates',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getRateById(rateId: string, experienceId: string): Promise<TurneoRate | TurneoApiError> {
  try {
    return await fetchRateById(rateId, experienceId)
  } catch (error) {
    console.error('Error fetching rate:', error)
    return {
      success: false,
      message: 'Failed to fetch rate',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 