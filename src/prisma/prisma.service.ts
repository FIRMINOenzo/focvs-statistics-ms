import { Global, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs, DynamicQueryExtensionArgs } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';
import { AppError } from 'src/shared/error/app-error';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  static readonly instance = new PrismaService();

  async onModuleInit() {
    await this.$connect();

    this.subscribe({
      async $allOperations({ args, query }) {
        return query(args);
      }
    });
  }

  public subscribe(
    model: DynamicQueryExtensionArgs<
      {
        [K in
          | Prisma.TypeMap['meta']['modelProps']
          | '$allModels'
          | keyof Prisma.TypeMap['other']['operations']
          | '$allOperations']?: unknown;
      },
      Prisma.TypeMap<DefaultArgs>
    >
  ) {
    Object.assign(this, this.$extends({ query: model }));
  }

  public static isKnownError(
    exception: unknown
  ): exception is Prisma.PrismaClientKnownRequestError {
    return exception instanceof Prisma.PrismaClientKnownRequestError;
  }

  public static isPrismaError(
    exception: unknown
  ): exception is
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientRustPanicError
    | Prisma.PrismaClientInitializationError
    | Prisma.PrismaClientUnknownRequestError
    | Prisma.PrismaClientValidationError {
    return (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError
    );
  }

  public static handleError(err: unknown) {
    if (PrismaService.isKnownError(err)) {
      switch (err.code) {
        case PrismaError.UniqueConstraintViolation:
          throw new AppError(`Duplicated ${err.meta.target}.`, HttpStatus.CONFLICT);

        case PrismaError.RecordsNotFound:
          throw new AppError(`${err.meta?.modelName ?? 'Record'} not found`, HttpStatus.NOT_FOUND);

        case PrismaError.ForeignConstraintViolation:
          throw new AppError(
            `Constraint violation on ${err.meta?.field_name}`,
            HttpStatus.PRECONDITION_FAILED
          );
      }
    }

    throw err;
  }
}
