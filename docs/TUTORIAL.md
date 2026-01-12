# Tutorial: Adding and Exposing a Component

This tutorial will guide you through creating a new React component in a Remote application and exposing it for the Host application to consume.

## Step 1: Create the Component

In `remote-app-1`, create a new component file `src/components/MyNewWidget.tsx`.

```tsx
import React from "react";

const MyNewWidget = () => {
  return (
    <div style={{ border: "1px solid blue", padding: "10px" }}>
      <h3>Hello from Remote 1!</h3>
      <p>This is a federated component.</p>
    </div>
  );
};

export default MyNewWidget;
```

## Step 2: Expose the Component

Open `vite.config.ts` in `remote-app-1` and update the `federation` plugin configuration.

```typescript
// remote-app-1/vite.config.ts
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "remote_app_1",
      filename: "remoteEntry.js",
      exposes: {
        "./MyNewWidget": "./src/components/MyNewWidget.tsx", // Add this line
      },
      // ... other config
    }),
    // ...
  ],
});
```

## Step 3: Register Types (Optional but Recommended)

If you are using TypeScript, you might need to restart the build server or run a type generation script to update `@mf-types` so the Host knows about the new component's types.

## Step 4: Consume in Host

Open `src/App.tsx` (or any other component) in `host-app`.

```tsx
import React, { Suspense } from "react";

// Lazy load the remote component
const MyNewWidget = React.lazy(() => import("remote_app_1/MyNewWidget"));

function App() {
  return (
    <div>
      <h1>Host Application</h1>
      <Suspense fallback={<div>Loading Widget...</div>}>
        <MyNewWidget />
      </Suspense>
    </div>
  );
}

export default App;
```

## Step 5: Verify

Run `npm run dev:all`. You should see the "Hello from Remote 1!" widget rendered inside the Host application.
