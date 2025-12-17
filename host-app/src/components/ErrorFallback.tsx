import "./ErrorFallback.css";
import { errorBoundaryConfig } from "../config/errorBoundary.config";

export type ErrorFallbackType =
  | "module-load"
  | "runtime"
  | "circuit-breaker"
  | "generic";

export interface ErrorFallbackProps {
  error: Error;
  moduleName: string;
  type?: ErrorFallbackType;
  onRetry?: () => void;
  retryCount?: number;
  maxRetries?: number;
  showDetails?: boolean;
}

/**
 * Reusable error fallback UI component for different error scenarios
 */
export function ErrorFallback({
  error,
  moduleName,
  type = "generic",
  onRetry,
  retryCount = 0,
  maxRetries = errorBoundaryConfig.maxRetries,
  showDetails = errorBoundaryConfig.showDetailedErrors,
}: ErrorFallbackProps) {
  const config = getErrorConfig(type);
  const canRetry = onRetry && retryCount < maxRetries;

  return (
    <div
      className={`error-fallback ${config.className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="error-fallback__icon" aria-hidden="true">
        {config.icon}
      </div>

      <h2 className="error-fallback__title">{config.title}</h2>

      <p className="error-fallback__message">{config.getMessage(moduleName)}</p>

      <div className="error-fallback__actions">
        {canRetry && (
          <button
            className="error-fallback__button error-fallback__button--primary"
            onClick={onRetry}
            disabled={retryCount >= maxRetries}
            aria-label="Retry loading module"
          >
            🔄 Retry
          </button>
        )}

        <button
          className="error-fallback__button error-fallback__button--secondary"
          onClick={() => window.location.reload()}
          aria-label="Refresh entire page"
        >
          🔃 Refresh Page
        </button>
      </div>

      {canRetry && (
        <p className="error-fallback__retry-info">
          Retry attempt {retryCount} of {maxRetries}
        </p>
      )}

      {showDetails && (
        <details className="error-fallback__details">
          <summary>Technical Details</summary>
          <div className="error-fallback__error-stack">
            <strong>Error:</strong> {error.message}
            {error.stack && (
              <>
                <br />
                <br />
                <strong>Stack Trace:</strong>
                <br />
                {error.stack}
              </>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

/**
 * Get error configuration based on error type
 */
function getErrorConfig(type: ErrorFallbackType) {
  const configs = {
    "module-load": {
      icon: "📦",
      title: "Module Load Error",
      getMessage: (moduleName: string) => (
        <>
          Failed to load the{" "}
          <span className="error-fallback__module-name">{moduleName}</span>{" "}
          module. This might be a temporary network issue.
        </>
      ),
      className: "error-fallback--warning",
    },
    runtime: {
      icon: "⚠️",
      title: "Component Error",
      getMessage: (moduleName: string) => (
        <>
          An error occurred in the{" "}
          <span className="error-fallback__module-name">{moduleName}</span>{" "}
          component. The rest of the application continues to work normally.
        </>
      ),
      className: "",
    },
    "circuit-breaker": {
      icon: "🚫",
      title: "Module Temporarily Unavailable",
      getMessage: (moduleName: string) => (
        <>
          The <span className="error-fallback__module-name">{moduleName}</span>{" "}
          module has failed multiple times and has been temporarily disabled.
          Please refresh the page to try again.
        </>
      ),
      className: "error-fallback--warning",
    },
    generic: {
      icon: "❌",
      title: "Something Went Wrong",
      getMessage: (moduleName: string) => (
        <>
          An unexpected error occurred with{" "}
          <span className="error-fallback__module-name">{moduleName}</span>.
        </>
      ),
      className: "",
    },
  };

  return configs[type];
}

/**
 * Minimal fallback component for critical errors
 */
export function MinimalErrorFallback({ moduleName }: { moduleName: string }) {
  return (
    <div className="error-fallback error-fallback--info">
      <p>⚠️ {moduleName} is currently unavailable</p>
    </div>
  );
}
