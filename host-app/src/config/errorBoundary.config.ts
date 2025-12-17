/**
 * Configuration for Error Boundary behavior
 */
export const errorBoundaryConfig = {
  // Maximum number of retry attempts for failed modules
  maxRetries: 3,

  // Initial retry delay in milliseconds
  retryDelay: 1000,

  // Use exponential backoff for retries (delay doubles each time)
  exponentialBackoff: true,

  // Show detailed error messages (dev only)
  showDetailedErrors: import.meta.env.DEV,

  // Enable circuit breaker to prevent repeated failures
  enableCircuitBreaker: true,

  // Number of consecutive failures before circuit breaker activates
  circuitBreakerThreshold: 5,

  // Log errors to console (dev mode)
  logToConsole: import.meta.env.DEV,

  // Report errors to monitoring service (production)
  reportToMonitoring: import.meta.env.PROD,
} as const;

export type ErrorBoundaryConfig = typeof errorBoundaryConfig;
