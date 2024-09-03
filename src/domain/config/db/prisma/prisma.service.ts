import { Global, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';
import { AppError } from 'src/domain/shared/error/app-error';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  static readonly instance = new PrismaService();

  async onModuleInit() {
    await this.$connect();
    this.subscribe({
      async $allOperations({ args, query }) {
        return query(args);
      },
    });
  }

  public subscribe(model: PrismaClient) {
    Object.assign(this, this.$extends({ query: model }));
  }

  public static isKnownError(
    exception: unknown,
  ): exception is PrismaClientKnownRequestError {
    return exception instanceof PrismaClientKnownRequestError;
  }

  public static isPrismaError(
    exception: unknown,
  ): exception is
    | PrismaClientKnownRequestError
    | PrismaClientRustPanicError
    | PrismaClientInitializationError
    | PrismaClientUnknownRequestError
    | PrismaClientValidationError {
    return (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientInitializationError ||
      exception instanceof PrismaClientUnknownRequestError ||
      exception instanceof PrismaClientValidationError
    );
  }

  public static handleError(err: unknown) {
    if (PrismaService.isKnownError(err)) {
      switch (err.code) {
        case PrismaError.UniqueConstraintViolation:
          throw new AppError(
            `Duplicated ${err.meta.target}.`,
            HttpStatus.CONFLICT,
          );

        case PrismaError.RecordsNotFound:
          throw new AppError(
            `${err.meta?.modelName ?? 'Record'} not found`,
            HttpStatus.NOT_FOUND,
          );

        case PrismaError.ForeignConstraintViolation:
          throw new AppError(
            `Constraint violation on ${err.meta?.field_name}`,
            HttpStatus.PRECONDITION_FAILED,
          );
      }
    }

    throw err;
  }
}
