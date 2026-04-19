import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import * as Sentry from '@sentry/nestjs';
import { Response } from 'express';

import { ResponseEntity } from '@src/common/response/response-entity';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const context = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        Sentry.captureException(exception, {
            level: httpStatus >= 500 ? 'error' : 'warning',
        });

        const responseBody =
            exception instanceof HttpException
                ? ResponseEntity.ERROR_WITH(exception.message)
                : ResponseEntity.ERROR();

        httpAdapter.reply(
            context.getResponse<Response>(),
            responseBody,
            httpStatus,
        );
    }
}
