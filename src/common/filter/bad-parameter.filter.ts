import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from '@nestjs/common';

import * as Sentry from '@sentry/nestjs';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';

import { CustomValidationError } from '@src/common/filter/custom-validation.error';
import { ResponseEntity } from '@src/common/response/response-entity';
import { ResponseStatus } from '@src/common/response/response-status.enum';

@Catch(BadRequestException)
export class BadParameterFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost): void {
        Sentry.captureException(exception, {
            level: 'warning',
        });

        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const message =
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
                ? exceptionResponse.message
                : exception.message;

        const data: CustomValidationError[] | string = Array.isArray(message)
            ? (message as CustomValidationError[])
            : String(message);

        response
            .status(status)
            .json(
                instanceToPlain(
                    ResponseEntity.ERROR_WITH_DATA<
                        CustomValidationError[] | string
                    >(
                        '요청 값에 문제가 있습니다.',
                        ResponseStatus.BAD_PARAMETER,
                        data,
                    ),
                ),
            );
    }
}
