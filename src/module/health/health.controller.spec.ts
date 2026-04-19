import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { DataSource } from 'typeorm';

import { expectOkResponseEntity } from '@src/util/test/expect-response-entity';
import { getTestNestApp } from '@src/util/test/get-test-nest-app';
import { resetTestDatabase } from '@src/util/test/reset-test-database';

describe('HealthController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        app = await getTestNestApp();
        dataSource = app.get(DataSource);
        await app.init();
    });

    beforeEach(async () => {
        await resetTestDatabase(dataSource);
    });

    afterAll(async () => {
        await app?.close();
    });

    describe('GET /health', () => {
        it('서버 상태를 조회할 수 있어야 합니다.', async () => {
            const response = await request(app.getHttpServer()).get('/health');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expectOkResponseEntity({ status: 'ok' }),
            );
        });
    });
});
