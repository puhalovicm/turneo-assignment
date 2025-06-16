export const APP_CONFIG = {
  PAGINATION: {
    DEFAULT_EXPERIENCES_LIMIT: 50,
    MAX_VISIBLE_PAGES: 5,
  },
  
  API: {
    DEFAULT_TIMEOUT: 30000, 
    RETRY_ATTEMPTS: 3,
  },
  
  UI: {
    SUCCESS_MESSAGE_DURATION: 3000, 
    LOADING_SKELETON_COUNT: 5,
  },
} as const;

export type AppConfig = typeof APP_CONFIG; 