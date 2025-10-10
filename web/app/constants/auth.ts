export const AUTH_CONFIG = {
  BACKEND_URL: 'http://localhost:4000',
  STORAGE_KEYS: {
    USER: 'google_user',
    TOKEN: 'access_token',
  },
  TIMEOUTS: {
    SUCCESS_REDIRECT: 1000,
    ERROR_REDIRECT: 3000,
  },
  ROUTES: {
    LOGIN: '/auth/google/login',
    CALLBACK: '/auth/callback',
    HOME: '/',
  },
} as const;
