export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class DuplicateError extends PublicError {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateError';
  }
}

export class NotFoundError extends PublicError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class TokenExpiredError extends PublicError {
  constructor() {
    super('Token has expired');
    this.name = 'TokenExpiredError';
  }
}

export class LoginError extends PublicError {
  constructor() {
    super('Invalid email or password');
    this.name = 'LoginError';
  }
}
