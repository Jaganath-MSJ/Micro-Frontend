# Learning Goals

This project is designed to demonstrate key patterns and technologies in modern Micro-Frontend development. By exploring this codebase, you will learn about:

## 1. Module Federation

- **Configuration**: How to configure `vite-plugin-module-federation` for Host and Remote applications.
- **Exposing Modules**: How to expose components and functions from a Remote application.
- **Consuming Remotes**: How to import and use federated modules in a Host application.
- **Shared Dependencies**: Managing shared libraries (like React, React Redux) to avoid version conflicts and reduce bundle size.

## 2. State Management in Micro-Frontends

- **Redux Toolkit**: Using Redux for local state management within individual apps.
- **Shared State**: Patterns for sharing state across micro-frontends (if applicable, or the challenges thereof).

## 3. Communication Patterns

- **Event Bus**: Using a shared event bus (`@trutoo/event-bus`) for decoupled communication between micro-frontends.

## 4. Routing

- **React Router**: Implementing routing in a micro-frontend architecture, handling navigation between the Host and Remotes.

## 5. TypeScript Integration

- **Type Federation**: How to generate and consume TypeScript types for federated modules (`@mf-types`) to ensure type safety across application boundaries.

## 6. Development Workflow

- **Monorepo Structure**: Managing multiple applications in a single repository.
- **Automation**: Using npm scripts to orchestrate tasks across multiple projects.
