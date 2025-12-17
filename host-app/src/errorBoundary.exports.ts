// Export all error boundary components and utilities for easy access
export { RemoteComponentWrapper } from "./components/RemoteComponentWrapper";
export { RemoteModuleErrorBoundary } from "./components/RemoteModuleErrorBoundary";
export {
  ErrorFallback,
  MinimalErrorFallback,
} from "./components/ErrorFallback";
export type {
  ErrorFallbackProps,
  ErrorFallbackType,
} from "./components/ErrorFallback";

// Export utilities
export { errorLogger } from "./utils/errorLogger";
export type {
  ModuleErrorContext,
  ModuleLoadContext,
  ErrorType,
} from "./utils/errorLogger";

export { moduleRegistry } from "./utils/moduleRegistry";
export type { ModuleMetadata, ModuleHealth } from "./utils/moduleRegistry";

// Export configuration
export { errorBoundaryConfig } from "./config/errorBoundary.config";
export type { ErrorBoundaryConfig } from "./config/errorBoundary.config";
