export class UpstreamUnavailableError extends Error {
  constructor(message = "Product catalogue is temporarily unavailable") {
    super(message);
    this.name = "UpstreamUnavailableError";
  }
}
export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}
