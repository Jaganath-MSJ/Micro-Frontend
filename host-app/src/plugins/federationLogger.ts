import type { ModuleFederationRuntimePlugin } from "@module-federation/enhanced/runtime";
import Logger from "./logger";

const logger = new Logger("HostApp-Runtime");

function federationLogger(): ModuleFederationRuntimePlugin {
  return {
    name: "federation-logger-plugin",
    beforeRequest(args) {
      const remoteName = args.id;
      logger.info(`Requested module: ${remoteName}`);
      performance.mark(`start-load-${remoteName}`);
      return args;
    },
    onLoad(args) {
      const remoteName = args.id;
      performance.mark(`end-load-${remoteName}`);

      const measureName = `load-time-${remoteName}`;
      performance.measure(
        measureName,
        `start-load-${remoteName}`,
        `end-load-${remoteName}`
      );

      const measures = performance.getEntriesByName(measureName);
      const duration = measures.length > 0 ? measures[0].duration : 0;

      logger.info(`Loaded module: ${remoteName}`, {
        duration: `${duration.toFixed(2)}ms`,
      });
      return args;
    },
    errorLoadRemote(args) {
      const remoteName = args.id;
      logger.error(`Failed to load module: ${remoteName}`, args.error);
      return args;
    },
  };
}

export default federationLogger;
