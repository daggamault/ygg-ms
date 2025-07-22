export const extractErrorMessage = (error: unknown) =>
  error instanceof Error && process.env.NODE_ENV !== 'production'
    ? error?.message
    : 'An error occurred';
