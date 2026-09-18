import { CrudGenError } from '@nest-yalc-2/crud-gen/crud-gen.error.js';
import { UUIDValidationError } from '@nest-yalc-2/graphql/scalars/uuid-validation.error.js';
import * as common from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationError } from '../index.js';

import type { LoggerService } from '@nestjs/common';

@common.Catch(UUIDValidationError, CrudGenError)
export class ValidationExceptionFilter implements GqlExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(error: Error) {
    const newError = new InputValidationError(
      (<CrudGenError>error).systemMessage,
      { response: { message: error.message } },
    );
    newError.stack = error.stack; // we need the stack trace for dev
    this.logger.error(
      (<CrudGenError>error).systemMessage ?? newError.message,
      newError.stack,
    );

    return newError;
  }
}
