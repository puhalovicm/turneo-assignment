'use server'

import { 
  fetchExperiences, 
  fetchExperienceById,
  type TurneoPaginatedResponse, 
  type TurneoExperience, 
  type TurneoApiError 
} from '../turneo-api'

export async function getExperiences(params?: {
  page?: number;
}): Promise<TurneoPaginatedResponse | TurneoApiError> {
  try {
    return await fetchExperiences(params)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return {
      success: false,
      message: 'Failed to fetch experiences',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getExperienceById(experienceId: string): Promise<TurneoExperience | TurneoApiError> {
  try {
    return await fetchExperienceById(experienceId)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return {
      success: false,
      message: 'Failed to fetch experience',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 