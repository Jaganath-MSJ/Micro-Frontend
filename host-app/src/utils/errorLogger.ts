/**
 * Centralized error logging utility for micro-frontend modules
 */

export type ErrorType = "LOAD_ERROR" | "RUNTIME_ERROR" | "UNKNOWN";

export interface ModuleErrorContext {
  moduleName: string;
  error: Error;
  errorType: ErrorType;
  retryCount?: number;
  timestamp?: number;
  additionalContext?: Record<string, unknown>;
}

export interface ModuleLoadContext {
  moduleName: string;
  loadTime: number;
  success: boolean;
  timestamp?: number;
}

class ErrorLogger {
  private errors: ModuleErrorContext[] = [];
  private loads: ModuleLoadContext[] = [];

  /**
   * Log a module error with full context
   */
  logModuleError(context: ModuleErrorContext): void {
    const enrichedContext: ModuleErrorContext = {
      ...context,
      timestamp: Date.now(),
    };

    this.errors.push(enrichedContext);

    // Console logging
    if (import.meta.env.DEV) {
      console.error(
        `[MFE Error] ${context.errorType} in ${context.moduleName}:`,
        {
          error: context.error,
          retryCount: context.retryCount,
          additionalContext: context.additionalContext,
        }
      );
    }

    // In production, you would send to monitoring service
    if (import.meta.env.PROD) {
      this.reportToMonitoring(enrichedContext);
    }
  }

  /**
   * Log module load success/failure
   */
  logModuleLoad(context: ModuleLoadContext): void {
    const enrichedContext: ModuleLoadContext = {
      ...context,
      timestamp: Date.now(),
    };

    this.loads.push(enrichedContext);

    if (import.meta.env.DEV) {
      console.log(
        `[MFE Load] ${context.moduleName} - ${
          context.success ? "SUCCESS" : "FAILED"
        } (${context.loadTime}ms)`
      );
    }
  }

  /**
   * Get all errors for a specific module
   */
  getModuleErrors(moduleName: string): ModuleErrorContext[] {
    return this.errors.filter((error) => error.moduleName === moduleName);
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      totalErrors: this.errors.length,
      byModule: this.groupByModule(this.errors),
      byType: this.groupByType(this.errors),
    };
  }

  /**
   * Clear error logs (useful for testing)
   */
  clearLogs(): void {
    this.errors = [];
    this.loads = [];
  }

  /**
   * Report error to monitoring service (Sentry, DataDog, etc.)
   */
  private reportToMonitoring(context: ModuleErrorContext): void {
    // TODO: Integrate with your monitoring service
    // Example for Sentry:
    // Sentry.captureException(context.error, {
    //   tags: {
    //     module: context.moduleName,
    //     errorType: context.errorType,
    //   },
    //   extra: context.additionalContext,
    // });

    console.warn("[MFE] Error reporting to monitoring service:", context);
  }

  private groupByModule(errors: ModuleErrorContext[]): Record<string, number> {
    return errors.reduce((acc, error) => {
      acc[error.moduleName] = (acc[error.moduleName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupByType(errors: ModuleErrorContext[]): Record<ErrorType, number> {
    return errors.reduce((acc, error) => {
      acc[error.errorType] = (acc[error.errorType] || 0) + 1;
      return acc;
    }, {} as Record<ErrorType, number>);
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();
