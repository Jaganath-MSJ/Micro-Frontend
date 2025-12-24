import React, { lazy, Suspense } from "react";

const Button = lazy(() => import("remote/Button"));

export default function App() {
  return (
    <div>
      <h1>Host App</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Button
          onClick={() => console.log("Button clicked")}
          name="Button from Remote 2"
          kskjs="kskjs"
        />
      </Suspense>
    </div>
  );
}
