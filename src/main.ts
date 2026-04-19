import './common/instrument';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@src/app.module';
import { setNestApp } from '@src/common/bootstrap/set-nest-app';

async function bootstrap(): Promise<void> {
    initializeTransactionalContext();

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    setNestApp(app);

    const configService = app.get(ConfigService);
    await app.listen(configService.get<number>('PORT', 3000));
}

void bootstrap();
