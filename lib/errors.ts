export class AppError extends Error {
  readonly statusCode: number;
  readonly userMessage: string;

  constructor(statusCode: number, userMessage: string, message?: string) {
    super(message ?? userMessage);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.userMessage = userMessage;
  }
}

export class NotFoundError extends AppError {
  constructor(userMessage = 'The requested resource was not found') {
    super(404, userMessage);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(userMessage = 'You are not authorized to perform this action') {
    super(401, userMessage);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends AppError {
  constructor(userMessage = 'This action conflicts with existing data') {
    super(409, userMessage);
    this.name = 'ConflictError';
  }
}

export class CancellationBlockedError extends AppError {
  constructor(
    userMessage = 'Cancellations are not allowed within 2 hours of departure'
  ) {
    super(422, userMessage);
    this.name = 'CancellationBlockedError';
  }
}

export class DatabaseError extends AppError {
  constructor(userMessage = 'Something went wrong. Please try again later') {
    super(500, userMessage);
    this.name = 'DatabaseError';
  }
}
