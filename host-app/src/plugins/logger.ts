export type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${
      this.serviceName
    }] [${level.toUpperCase()}]: ${message}`;
  }

  private log(level: LogLevel, message: string, meta?: unknown) {
    const formattedMessage = this.formatMessage(level, message);

    switch (level) {
      case "info":
        console.info(formattedMessage, meta || "");
        break;
      case "warn":
        console.warn(formattedMessage, meta || "");
        break;
      case "error":
        console.error(formattedMessage, meta || "");
        break;
      case "debug":
        console.debug(formattedMessage, meta || "");
        break;
    }
  }

  info(message: string, meta?: unknown) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: unknown) {
    this.log("error", message, meta);
  }

  debug(message: string, meta?: unknown) {
    this.log("debug", message, meta);
  }
}

export default Logger;
