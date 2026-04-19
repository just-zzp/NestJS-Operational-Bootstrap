import {
    BadRequestException,
    ClassSerializerInterceptor,
    ValidationError,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import expressBasicAuth from 'express-basic-auth';

import { AllExceptionsFilter } from '@src/common/filter/all-exceptions.filter';
import { BadParameterFilter } from '@src/common/filter/bad-parameter.filter';
import { CustomValidationError } from '@src/common/filter/custom-validation.error';
import { BigIntToStringInterceptor } from '@src/common/interceptor/big-int-to-string.interceptor';
import { JsJodaToStringInterceptor } from '@src/common/interceptor/js-joda-to-string.interceptor';

export function setNestApp<T extends NestExpressApplication>(app: T): void {
    app.useStaticAssets('public', {
        prefix: '/public/',
    });

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
        new BigIntToStringInterceptor(),
        new JsJodaToStringInterceptor(),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (
                validationErrors: ValidationError[] = [],
            ): BadRequestException =>
                new BadRequestException(
                    validationErrors.map(
                        (error) => new CustomValidationError(error),
                    ),
                ),
        }),
    );

    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(
        new AllExceptionsFilter(httpAdapterHost),
        new BadParameterFilter(),
    );

    app.getHttpAdapter().getInstance().disable('x-powered-by');

    setupSwagger(app);
}

function setupSwagger<T extends NestExpressApplication>(app: T): void {
    const configService = app.get(ConfigService);
    const swaggerAuthId = configService.get<string>('SWAGGER_AUTH_ID');
    const swaggerAuthPw = configService.get<string>('SWAGGER_AUTH_PW');
    const swaggerPath = configService.get<string>('SWAGGER_PATH');
    const nodeEnv = configService.get<string>('NODE_ENV');

    if (
        !swaggerAuthId ||
        !swaggerAuthPw ||
        !swaggerPath ||
        nodeEnv === 'production'
    ) {
        return;
    }

    app.use(
        [swaggerPath],
        expressBasicAuth({
            challenge: true,
            users: {
                [swaggerAuthId]: swaggerAuthPw,
            },
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
