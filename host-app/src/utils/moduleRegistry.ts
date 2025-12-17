/**
 * Module Registry - Track module health and implement circuit breaker pattern
 */

import { errorBoundaryConfig } from "../config/errorBoundary.config";

export interface ModuleMetadata {
  name: string;
  url?: string;
  version?: string;
  registeredAt: number;
}

export interface ModuleHealth {
  moduleName: string;
  totalAttempts: number;
  failureCount: number;
  successCount: number;
  consecutiveFailures: number;
  circuitBreakerActive: boolean;
  lastFailureTime?: number;
  lastSuccessTime?: number;
}

class ModuleRegistry {
  private modules = new Map<string, ModuleMetadata>();
  private healthRecords = new Map<string, ModuleHealth>();

  /**
   * Register a module with metadata
   */
  registerModule(name: string, metadata: Partial<ModuleMetadata> = {}): void {
    this.modules.set(name, {
      name,
      registeredAt: Date.now(),
      ...metadata,
    });

    // Initialize health record
    if (!this.healthRecords.has(name)) {
      this.healthRecords.set(name, {
        moduleName: name,
        totalAttempts: 0,
        failureCount: 0,
        successCount: 0,
        consecutiveFailures: 0,
        circuitBreakerActive: false,
      });
    }
  }

  /**
   * Record a module failure
   */
  recordModuleFailure(moduleName: string): void {
    const health = this.getModuleHealth(moduleName);

    health.totalAttempts++;
    health.failureCount++;
    health.consecutiveFailures++;
    health.lastFailureTime = Date.now();

    // Activate circuit breaker if threshold exceeded
    if (
      errorBoundaryConfig.enableCircuitBreaker &&
      health.consecutiveFailures >= errorBoundaryConfig.circuitBreakerThreshold
    ) {
      health.circuitBreakerActive = true;
      console.warn(
        `[Circuit Breaker] Activated for module: ${moduleName} after ${health.consecutiveFailures} consecutive failures`
      );
    }

    this.healthRecords.set(moduleName, health);
  }

  /**
   * Record a module success
   */
  recordModuleSuccess(moduleName: string): void {
    const health = this.getModuleHealth(moduleName);

    health.totalAttempts++;
    health.successCount++;
    health.consecutiveFailures = 0; // Reset consecutive failures
    health.circuitBreakerActive = false; // Deactivate circuit breaker
    health.lastSuccessTime = Date.now();

    this.healthRecords.set(moduleName, health);
  }

  /**
   * Get module health status
   */
  getModuleHealth(moduleName: string): ModuleHealth {
    if (!this.healthRecords.has(moduleName)) {
      this.registerModule(moduleName);
    }
    return { ...this.healthRecords.get(moduleName)! };
  }

  /**
   * Check if module should be blocked due to circuit breaker
   */
  shouldBlockModule(moduleName: string): boolean {
    const health = this.getModuleHealth(moduleName);
    return health.circuitBreakerActive;
  }

  /**
   * Manually reset circuit breaker for a module
   */
  resetCircuitBreaker(moduleName: string): void {
    const health = this.getModuleHealth(moduleName);
    health.circuitBreakerActive = false;
    health.consecutiveFailures = 0;
    this.healthRecords.set(moduleName, health);
    console.log(`[Circuit Breaker] Reset for module: ${moduleName}`);
  }

  /**
   * Get all registered modules
   */
  getAllModules(): ModuleMetadata[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get health summary for all modules
   */
  getHealthSummary(): Record<string, ModuleHealth> {
    const summary: Record<string, ModuleHealth> = {};
    this.healthRecords.forEach((health, moduleName) => {
      summary[moduleName] = health;
    });
    return summary;
  }

  /**
   * Clear all registry data (useful for testing)
   */
  clear(): void {
    this.modules.clear();
    this.healthRecords.clear();
  }
}

// Singleton instance
export const moduleRegistry = new ModuleRegistry();
