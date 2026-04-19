# 테스트 작성 지침

이 bootstrap은 다음 테스트 방식을 기본값으로 둔다.

## 테스트 종류

- 순수 도메인/entity/util 테스트: Nest app을 띄우지 않고 class/function을 직접 검증한다.
- service/repository/controller 통합 테스트: `getTestNestApp()`으로 실제 `AppModule`을 띄운다.
- HTTP 테스트: `supertest`로 `app.getHttpServer()`에 요청한다.
- 외부 API 테스트: 기본적으로 mock 처리한다. 실제 호출 테스트는 `it.skip`으로 두고 명시적으로만 실행한다.

## 통합 테스트 골격

```ts
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import request from 'supertest';
import { DataSource } from 'typeorm';

import { getTestNestApp } from '@src/util/test/get-test-nest-app';
import { resetTestDatabase } from '@src/util/test/reset-test-database';
import { TestAuth } from '@src/util/test/test-auth';

describe('FeatureController (e2e)', () => {
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
        await app.close();
    });

    it('관리자는 기능을 사용할 수 있어야 합니다.', async () => {
        const token = await testAuth.createAccessToken({
            sub: 'admin-id',
            role: 'ADMIN',
        });

        const response = await request(app.getHttpServer())
            .get('/v1/features')
            .set('Authorization', testAuth.bearer(token));

        expect(response.status).toBe(200);
    });
});
```

## 작성 규칙

1. 통합 테스트는 `beforeAll`에서 app과 repository/service를 꺼내고 `afterAll`에서 app을 닫는다.
2. DB를 쓰는 테스트는 `beforeEach`에서 `resetTestDatabase(dataSource)`를 호출한다.
3. HTTP 응답은 status와 `ResponseEntity` body를 함께 검증한다.
4. 저장 결과는 가능하면 repository로 다시 조회해 DB 상태까지 검증한다.
5. 인증이 필요한 테스트는 `TestAuth`로 JWT를 발급한다.
6. 외부 서비스는 `jest.mock(...)` 또는 provider override로 막는다.
7. 실제 외부 API 호출 테스트는 `it.skip`으로 둔다.
8. 날짜/시간 응답은 문자열, entity 조회 결과는 js-joda 타입으로 검증한다.
9. test fixture는 도메인별 `Test<Domain>` helper에 모아 중복 setup을 줄인다.
10. 한 테스트는 하나의 관찰 가능한 행위와 그 side effect를 검증한다.
