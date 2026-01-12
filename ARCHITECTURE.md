# Architecture

This project uses a **Micro-Frontend Architecture** to break down a monolithic frontend into smaller, manageable, and independently deployable applications.

## Core Concepts

### Module Federation

We utilize **Webpack Module Federation** (via `@module-federation/vite`) to dynamically load code from different builds at runtime. This allows:

- **Host Application**: Serves as the shell, defining the layout and routing. It loads remote modules on demand.
- **Remote Applications**: Standalone applications that expose specific components or modules (e.g., a "Cart" widget, a "Product List" page) to be consumed by the Host.

### Shared Dependencies

To prevent code duplication and ensure singleton instances of critical libraries (like React and Redux), Module Federation is configured to share these dependencies.

- **Singletons**: `react`, `react-dom`, `react-redux`, `@trutoo/event-bus`.
- **Version Control**: The system negotiates versions to ensure compatibility.

### Communication

Since applications run in isolation but share the same window, communication is handled via:

1.  **Shared Event Bus**: We use `@trutoo/event-bus` (located in `shared-utils`) for loosely coupled communication.
    - _Example_: `remote-app-1` fires an `ADD_TO_CART` event -> `host-app` listening to this event updates the UI.
2.  **Props**: Direct data passing when the Host renders a Remote component.

### State Management

- **Local State**: Each application manages its own internal state using Redux Toolkit or React Context.
- **Global State**: Minimal global state is maintained in the Host or communicated via the Event Bus. We avoid a single global Redux store for all apps to maintain decoupling.

## Diagram

```mermaid
graph TD
    User[User Browser]
    Host[Host App (Port 5000)]
    Remote1[Remote App 1 (Port 5001)]
    Remote2[Remote App 2 (Port 5002)]
    Shared[Shared Utils]

    User --> Host
    Host -- Loads Modules --> Remote1
    Host -- Loads Modules --> Remote2
    Host -- Uses --> Shared
    Remote1 -- Uses --> Shared
    Remote2 -- Uses --> Shared

    Remote1 -. Events .-> Host
    Remote2 -. Events .-> Host
```
