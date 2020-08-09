import debug from "debug";

export class Level {
  public static readonly TRACE = new Level("trace", "lightblue");
  public static readonly INFO = new Level("info", "blue");
  public static readonly WARN = new Level("warn", "yellow");
  public static readonly ERROR = new Level("error", "red");

  private constructor(
    public readonly name: string,
    public readonly color: string
  ) {}
}

class Log {
  private static generateMessage(
    level: Level,
    message: string,
    source: string
  ) {
    const namespace = `transcribe:${level.name}`;
    const createDebug = debug(namespace);

    createDebug.color = level.color;

    if (source) {
      createDebug(source, message);
    } else {
      createDebug(message);
    }
  }

  static trace(message: string, source: string): void {
    this.generateMessage(Level.TRACE, message, source);
  }

  static info(message: string, source: string): void {
    this.generateMessage(Level.INFO, message, source);
  }

  static warn(message: string, source: string): void {
    this.generateMessage(Level.WARN, message, source);
  }

  static error(message: string, source: string): void {
    this.generateMessage(Level.ERROR, message, source);
  }
}

export default Log;
