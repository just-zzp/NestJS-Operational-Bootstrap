import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SentryModule } from '@sentry/nestjs/setup';
import { DataSource } from 'typeorm';
import {
    addTransactionalDataSource,
    getDataSourceByName,
} from 'typeorm-transactional';

import { AppController } from '@src/app.controller';
import { validateEnv } from '@src/common/config/env.validation';
import { LoggerMiddleware } from '@src/common/middleware/logger.middleware';
import { entityList } from '@src/entity/entity.module';
import { migrations } from '@src/entity/migrations';
import { CoreModule } from '@src/module/core.module';

@Module({
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow<string>('DB_HOST'),
                port: configService.getOrThrow<number>('DB_PORT'),
                username: configService.getOrThrow<string>('DB_USERNAME'),
                password: configService.getOrThrow<string>('DB_PASSWORD'),
                database: configService.getOrThrow<string>('DB_DATABASE'),
                entities: [...entityList],
                migrations: [...migrations],
                migrationsRun:
                    configService.get<string>('DB_MIGRATIONS_RUN') === 'true',
                autoLoadEntities: true,
                logging: configService.get<string>('DB_LOGGING') === 'true',
                ssl: ['production', 'development'].includes(
                    configService.get<string>('NODE_ENV', 'local'),
                )
                    ? { rejectUnauthorized: false }
                    : false,
            }),
            dataSourceFactory: async (options) => {
                if (!options) {
                    throw new Error('Invalid TypeORM options');
                }

                return (
                    getDataSourceByName('default') ||
                    addTransactionalDataSource(new DataSource(options))
                );
            },
        }),
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        CacheModule.register(),
        CoreModule,
    ],
    controllers: [AppController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
