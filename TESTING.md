# 테스트 코드 작성 지침

이 bootstrap은 도메인 특수 fixture가 없는 형태를 시작점으로 한다.

## 테스트 철학

테스트는 단순히 method return만 보는 것이 아니라, 요청/응답 계약과 DB side effect를 함께 확인한다. Nest module wiring, global pipe/filter/interceptor, JWT guard, TypeORM transformer가 실제로 결합된 상태에서 깨지지 않는지를 중요하게 본다.

## 테스트 종류

- 순수 단위 테스트: Entity, value object, util, validator처럼 외부 의존성이 없는 코드를 직접 검증한다.
- 통합 테스트: Service, Repository, Controller를 실제 `AppModule`과 Postgres 위에서 검증한다.
- HTTP e2e 스타일 테스트: `supertest`로 `app.getHttpServer()`에 요청한다. 파일명은 기존 관례에 맞춰 `*.controller.spec.ts`처럼 `src` 아래에 둔다.
- 외부 API 테스트: 기본값은 mock이다. 실제 외부 API를 호출하는 테스트는 `it.skip`으로 두고, 필요한 사람이 명시적으로 skip을 해제한다.

## 공통 패턴

```ts
describe('FeatureController (e2e)', () => {
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
        await app.close();
    });
});
```

## 작성 규칙

1. DB를 사용하는 테스트는 매 테스트마다 `resetTestDatabase(dataSource)`로 초기화한다.
2. HTTP 테스트는 status code와 `ResponseEntity` body shape를 같이 검증한다.
3. 쓰기 API는 repository로 다시 조회해서 DB 상태를 확인한다.
4. 인증이 필요한 요청은 `TestAuth`로 JWT를 발급한다.
5. role 검증은 `role` 또는 `roles` payload를 명시해 테스트한다.
6. 날짜/시간 응답은 문자열로, entity 조회 결과는 js-joda 타입으로 검증한다.
7. 실패 케이스는 정상 케이스와 같은 수준으로 status code와 오류 wrapper를 확인한다.
8. fixture 생성이 반복되면 `src/util/test/Test<Domain>.ts` helper로 분리한다.
9. 외부 API, 파일 시스템, 시간 의존 로직은 mock 또는 명시적인 now parameter로 제어한다.
10. 한 테스트는 하나의 사용자 행위 또는 하나의 도메인 규칙만 검증한다.

## 현재 bootstrap에 포함된 테스트 유틸

- `getTestNestApp`: 실제 `AppModule`로 Nest app 생성 후 전역 설정 적용.
- `resetTestDatabase`: TypeORM `synchronize(true)`로 DB 초기화.
- `TestAuth`: 테스트용 JWT 발급과 Bearer header 문자열 생성.
- `expectOkResponseEntity`: 성공 응답 wrapper expectation 생성.
- `createUnitTestingModule`: 간단한 Nest unit testing module 생성.

## 실행

로컬에 Postgres가 준비되어 있고 `.env`가 채워져 있으면 다음을 실행한다.

```shell
npm run test
```

DB 설정 또는 Postgres가 없으면 DB 통합 테스트는 실패해야 한다. 이 실패는 정상 구동 조건이 충족되지 않았다는 신호로 취급한다.

Docker 기반으로는 다음을 실행한다.

```shell
npm run test:docker
```

`test:docker`는 Postgres healthcheck가 통과한 뒤 app 테스트 컨테이너를 실행한다. bootstrap의 정상 구동 상태를 증명하려면 이 명령 또는 동일한 DB 환경에서 `npm run test`가 모두 통과해야 한다.
