import React, { Component, type ReactNode } from "react";
import { ErrorFallback, type ErrorFallbackType } from "./ErrorFallback";
import { errorLogger } from "../utils/errorLogger";
import { moduleRegistry } from "../utils/moduleRegistry";
import { errorBoundaryConfig } from "../config/errorBoundary.config";

interface RemoteModuleErrorBoundaryProps {
  children: ReactNode;
  moduleName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface RemoteModuleErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  errorType: ErrorFallbackType;
}

/**
 * Error Boundary specifically designed for remote micro-frontend modules
 *
 * Features:
 * - Catches errors from remote module loading and runtime
 * - Provides retry mechanism with exponential backoff
 * - Logs errors with module context
 * - Integrates with circuit breaker pattern
 * - Shows fallback UI based on error type
 */
export class RemoteModuleErrorBoundary extends Component<
  RemoteModuleErrorBoundaryProps,
  RemoteModuleErrorBoundaryState
> {
  constructor(props: RemoteModuleErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorType: "generic",
    };

    // Register module
    moduleRegistry.registerModule(props.moduleName);
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<RemoteModuleErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorType: determineErrorType(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { moduleName, onError } = this.props;

    // Log error with context
    errorLogger.logModuleError({
      moduleName,
      error,
      errorType:
        determineErrorType(error) === "module-load"
          ? "LOAD_ERROR"
          : "RUNTIME_ERROR",
      retryCount: this.state.retryCount,
      additionalContext: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Record failure in module registry
    moduleRegistry.recordModuleFailure(moduleName);

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    const { moduleName, onReset } = this.props;
    const { retryCount } = this.state;

    // Check circuit breaker
    if (moduleRegistry.shouldBlockModule(moduleName)) {
      this.setState({
        errorType: "circuit-breaker",
      });
      return;
    }

    // Calculate retry delay with exponential backoff
    const delay = errorBoundaryConfig.exponentialBackoff
      ? errorBoundaryConfig.retryDelay * Math.pow(2, retryCount)
      : errorBoundaryConfig.retryDelay;

    console.log(`[Retry] Attempting to reload ${moduleName} in ${delay}ms...`);

    setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));

      if (onReset) {
        onReset();
      }
    }, delay);
  };

  resetErrorBoundary = (): void => {
    const { moduleName } = this.props;

    // Reset circuit breaker if needed
    if (moduleRegistry.shouldBlockModule(moduleName)) {
      moduleRegistry.resetCircuitBreaker(moduleName);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorType: "generic",
    });
  };

  render(): ReactNode {
    const { hasError, error, retryCount, errorType } = this.state;
    const { children, moduleName, fallback } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Otherwise use default ErrorFallback component
      return (
        <ErrorFallback
          error={error}
          moduleName={moduleName}
          type={errorType}
          onRetry={this.handleRetry}
          retryCount={retryCount}
          maxRetries={errorBoundaryConfig.maxRetries}
          showDetails={errorBoundaryConfig.showDetailedErrors}
        />
      );
    }

    return children;
  }
}

/**
 * Determine the type of error based on error message and properties
 */
function determineErrorType(error: Error): ErrorFallbackType {
  const errorMessage = error.message.toLowerCase();

  // Check for module loading errors
  if (
    errorMessage.includes("loading chunk") ||
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("networkerror") ||
    errorMessage.includes("import") ||
    error.name === "ChunkLoadError"
  ) {
    return "module-load";
  }

  // Check for runtime errors
  if (
    errorMessage.includes("cannot read") ||
    errorMessage.includes("undefined") ||
    errorMessage.includes("null") ||
    error.name === "TypeError" ||
    error.name === "ReferenceError"
  ) {
    return "runtime";
  }

  return "generic";
}
