/**
 * A utility class for handling common URL actions such as getting current hostname etc.
 */
export class URLHandlerUtilityClass {
  constructor() {}
  public static getFullyQualifiedHostPath(): string {
    return `${this.getProtocol()}//${this.getHost()}`;
  }
  public static getProtocol(): string {
    return window.location.protocol;
  }
  public static getHost(): string {
    return window.location.host;
  }
}