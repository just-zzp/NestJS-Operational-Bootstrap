import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import dotenv from 'dotenv';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@src/app.module';
import { setNestApp } from '@src/common/bootstrap/set-nest-app';

dotenv.config();

let transactionalContextInitialized = false;

export const getTestNestApp = async (): Promise<INestApplication> => {
    if (!transactionalContextInitialized) {
        initializeTransactionalContext();
        transactionalContextInitialized = true;
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    const app = moduleFixture.createNestApplication<NestExpressApplication>();

    setNestApp(app);

    return app;
};
