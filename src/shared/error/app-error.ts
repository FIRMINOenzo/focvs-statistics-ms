import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  public declare cause: string | string[];

  constructor(message: string | string[], statusCode = 400) {
    super(message[0] ?? message, statusCode);
    this.cause = message;
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'User does not have permission to access this resource') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
