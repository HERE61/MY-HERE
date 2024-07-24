export class RateLimitError extends Error {
  constructor() {
    super('너무 많은 요청을 하였습니다');
    this.name = 'RateLimitError';
  }
}
