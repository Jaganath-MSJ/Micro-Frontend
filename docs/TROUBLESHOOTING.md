# Troubleshooting

Here are some common issues you might encounter and how to resolve them.

## 1. "Remote Module Not Found" or 404 Errors

**Symptoms**: The Host app loads, but the Remote component is missing or you see network errors in the console.
**Possible Causes**:

- The Remote application is not running.
- The port number in the Host's `vite.config.ts` (remotes section) doesn't match the port the Remote is actually running on.
- The `filename` in the Remote's `vite.config.ts` (default `remoteEntry.js`) is incorrect.
  **Fix**:
- Ensure all apps are running (`npm run dev:all`).
- Verify ports: Host should look for `http://localhost:5001/remoteEntry.js` (for Remote 1).

## 2. Type Errors Importing Remotes

**Symptoms**: `Cannot find module 'remote_app_1/...'` in your IDE.
**Fix**:

- Ensure `@mf-types` are generated. Run the build command or wait for the dev server to generate them.
- Check if your `tsconfig.json` paths include the `@mf-types` directory.
- Use `// @ts-ignore` temporarily if you are sure the runtime works (not recommended for production).

## 3. "Shared module is not available for eager consumption"

**Symptoms**: App crashes with an uncaught error about shared modules (like React).
**Fix**:

- This usually happens when the entry point imports shared dependencies synchronously.
- Ensure your `index.html` imports the main entry file as a module (`type="module"`).
- Module Federation handles the async loading of shared deps transparently in most Vite setups, but ensure your `vite.config.ts` shared configuration is correct (e.g., `singleton: true`).

## 4. CORS Issues

**Symptoms**: Fetch errors blocking `remoteEntry.js`.
**Fix**:

- Vite's dev server usually handles CORS by default. If you see this in production, ensure your server (Nginx/S3) is configured to allow Cross-Origin Resource Sharing from your Host domain.

## 5. Changes Not Reflecting

**Symptoms**: You updated a Remote component, but the Host still shows the old version.
**Fix**:

- Browser cache might be holding the old `remoteEntry.js`. Try a hard refresh (Ctrl+F5 or Cmd+Shift+R).
- Restart the dev servers to clear any internal caching.
