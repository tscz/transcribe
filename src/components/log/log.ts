import debug from "debug";

enum Level {
  TRACE = "trace",
  INFO = "info",
  WARN = "warn",
  ERROR = "error"
}

const LEVEL_TO_COLOR = new Map<Level, string>([
  [Level.TRACE, "lightblue"],
  [Level.INFO, "blue"],
  [Level.WARN, "yellow"],
  [Level.ERROR, "red"]
]) as ReadonlyMap<Level, string>;

class Log {
  private static generateMessage(
    level: Level,
    message: string,
    source: string
  ) {
    const namespace = `transcribe:${level}`;
    const createDebug = debug(namespace);

    createDebug.color = LEVEL_TO_COLOR.get(level)!;

    if (source) {
      createDebug(source, message);
    } else {
      createDebug(message);
    }
  }

  static trace(message: string, source: string) {
    return this.generateMessage(Level.TRACE, message, source);
  }

  static info(message: string, source: string) {
    return this.generateMessage(Level.INFO, message, source);
  }

  static warn(message: string, source: string) {
    return this.generateMessage(Level.WARN, message, source);
  }

  static error(message: string, source: string) {
    return this.generateMessage(Level.ERROR, message, source);
  }
}

export default Log;
