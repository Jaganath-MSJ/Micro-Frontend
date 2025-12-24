import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";
import { dependencies } from "./package.json";

export default createModuleFederationConfig({
  name: "remote",
  exposes: {
    "./Button": "./src/Button",
  },
  filename: "remoteEntry.js",
  shared: {
    ...dependencies,
    react: {
      singleton: true,
    },
    "react-dom": {
      singleton: true,
    },
  },
});
