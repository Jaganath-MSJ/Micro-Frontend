# Micro-Frontend Error Handling Architecture

## Overview

This project implements a robust, multi-layered error handling strategy designed to ensure the host application remains stable even when remote modules fail.

## Core Components

### 1. `RemoteModuleErrorBoundary`

**Role:** The first line of defense.

- Wraps individual remote modules.
- Catches both **module loading errors** (network issues, 404s) and **runtime errors** (crashes inside the component).
- Implements **Exponential Backoff Retry** logic.

### 2. `AppErrorBoundary`

**Role:** The safety net.

- Wraps the entire application.
- Catches errors that bubble up past the module level.
- Renders a "critical failure" UI requiring a full page reload.

### 3. `RemoteComponentWrapper`

**Role:** The developer interface.

- Combines `Suspense` (for async loading) and `RemoteModuleErrorBoundary`.
- Simplifies usage in `Router.tsx`.

### 4. `moduleRegistry` & Circuit Breaker

**Role:** Health monitoring.

- Tracks failure counts for every module.
- **Circuit Breaker:** If a module fails 5 times (configurable) consecutively, it stops trying to load it and immediately shows a "Temporarily Unavailable" message to prevent resource exhaustion and infinite loops.

### 5. `errorLogger`

**Role:** observability.

- Centralizes error reporting.
- Logs to console in Dev.
- Ready for integration with Sentry/Datadog in Prod.

## Data Flow

1. **User navigates** to `/remote-1`.
2. `Router.tsx` uses `RemoteComponentWrapper` to load `remote-app-1/Button`.
3. **If successful:** Component renders. `moduleRegistry` records success.
4. **If failed (Network/404):**
   - `RemoteModuleErrorBoundary` catches error.
   - `errorLogger` logs `LOAD_ERROR`.
   - `ErrorFallback` shows "Module Load Error" with a Retry button.
5. **If failed (Runtime):**
   - `RemoteModuleErrorBoundary` catches error.
   - `errorLogger` logs `RUNTIME_ERROR`.
   - `ErrorFallback` shows "Component Error".

## Configuration

Settings can be tweaked in `host-app/src/config/errorBoundary.config.ts`:

- `maxRetries`: Default 3.
- `circuitBreakerThreshold`: Default 5.
- `retryDelay`: Default 1000ms.
