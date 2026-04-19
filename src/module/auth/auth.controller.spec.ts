import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import request from 'supertest';
import { DataSource } from 'typeorm';

import { getTestNestApp } from '@src/util/test/get-test-nest-app';
import { resetTestDatabase } from '@src/util/test/reset-test-database';
import { TestAuth } from '@src/util/test/test-auth';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let testAuth: TestAuth;

    beforeAll(async () => {
        app = await getTestNestApp();
        dataSource = app.get(DataSource);
        testAuth = new TestAuth(app.get(JwtService));
        await app.init();
    });

    beforeEach(async () => {
        await resetTestDatabase(dataSource);
    });

    afterAll(async () => {
        await app?.close();
    });

    describe('POST /v1/auth/verify-token', () => {
        it('유효한 토큰이면 payload를 반환해야 합니다.', async () => {
            const payload = { sub: 'admin-id', role: 'ADMIN' };
            const accessToken = await testAuth.createAccessToken(payload);

            const response = await request(app.getHttpServer())
                .post('/v1/auth/verify-token')
                .set('Authorization', testAuth.bearer(accessToken));

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                statusCode: 'OK',
                message: '',
                data: expect.objectContaining(payload),
            });
        });

        it('토큰이 없으면 401을 반환해야 합니다.', async () => {
            const response = await request(app.getHttpServer()).post(
                '/v1/auth/verify-token',
            );

            expect(response.status).toBe(401);
        });
    });
});
