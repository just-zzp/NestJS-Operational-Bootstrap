# NestJS Operational Bootstrap

NestJS 서버 범용 bootstrap입니다.

## 포함된 구조

- `AppModule` 기반 환경 변수 검증, TypeORM, schedule, event emitter, cache, Sentry 연결
- `setNestApp` 기반 전역 validation pipe, exception filter, interceptor, Swagger, URI versioning
- `ResponseEntity` 공통 응답 wrapper
- JWT 기반 전역 `AuthGuard`, `@Public`, `@Roles`, `@CurrentUser`
- TypeORM `BaseModel`, js-joda transformer, migration registry 자리
- paging/search date DTO, TypeORM 검색 helper, validator helper
- public health endpoint
- `getTestNestApp`, DB reset, JWT 발급 helper, 예시 spec을 포함한 테스트 bootstrap

## 시작

Node.js는 `20.19.0` 이상을 기준으로 합니다. Docker 실행은 `node:22.13.1` 이미지를 사용합니다.

Docker로 DB와 app을 함께 띄우는 경로가 가장 재현성이 높습니다.

```shell
npm install
docker compose up --build
```

로컬 Node 프로세스로 직접 실행하려면 PostgreSQL을 먼저 준비하고 `.env`를 채웁니다.

```shell
npm install
cp .env.example .env
npm run start:dev
```

health check:

```shell
curl http://localhost:3000/health
```

버전이 붙은 API는 기본적으로 `/v1/...` 형식을 사용합니다. health endpoint는 version neutral입니다.

## 새 도메인 모듈 추가 순서

1. `src/entity/<domain>/<domain>.entity.ts`에 entity를 만든다.
2. 필요한 repository를 `src/entity/<domain>/<domain>.repository.ts`에 만든다.
3. `src/entity/entity.module.ts`의 `entityList`, `repositoryList`에 등록한다.
4. `src/module/<domain>` 아래에 module, controller, service, dto를 만든다.
5. `src/module/core.module.ts`에 domain module을 import한다.
6. 여러 aggregate를 함께 바꾸는 use case는 service method에 `@Transactional()`을 붙인다.
7. controller/service/repository 테스트는 `TESTING.md`의 공통 패턴을 따라 작성한다.

## Migration

새 migration은 다음 명령으로 생성한다.

```shell
npm run migration:create -- AddExampleTable
```

이 명령은 `src/entity/migrations`에 migration 파일을 만들고 `src/entity/migrations/index.ts`를 현재 migration 파일 목록 기준으로 재생성한다. migration 파일을 직접 추가하거나 이름을 바꿨다면 다음 명령으로 registry만 다시 맞춘다.

```shell
npm run migration:sync
```

`data-source.ts`는 `src/entity/migrations/index.ts`의 `migrations` registry를 참조한다. 따라서 `data-source.ts`를 직접 수정하지 않는다.

production에서는 app boot 시 migration을 자동 실행하지 않는 것을 기본값으로 둔다. 여러 app instance가 동시에 뜰 때 같은 migration을 동시에 실행하는 상황을 피하기 위해서다. 배포 파이프라인에서는 app rollout 전에 단일 job 또는 단일 command로 migration을 먼저 실행한다.

```shell
npm run migration:run
npm run start:prod
```

`DB_MIGRATIONS_RUN=true`를 설정하면 app boot 시 pending migration을 자동 실행한다. 단일 instance local/dev 환경처럼 동시 실행 위험이 없는 경우에만 사용한다.

## 테스트

테스트 작성 기준은 `TESTING.md`와 `src/util/test/TESTING_GUIDE.md`에 정리되어 있습니다.

```shell
npm run test:docker
```

`npm run test`는 target 프로젝트와 같은 방식으로 실제 `AppModule`과 PostgreSQL에 붙습니다. 로컬에서 직접 실행하려면 `.env` 또는 shell 환경변수에 DB/JWT 값을 먼저 제공해야 합니다.

## 인증 정책

이 bootstrap은 특정 User 테이블을 강제하지 않습니다. JWT payload를 검증해 `request.user`에 싣고, `@Roles()`는 payload의 `role` 또는 `roles` 값을 검사합니다.

실제 서비스에서는 로그인 use case를 도메인 User/Auth 모듈에서 구현하고, `AuthService.signPayload()`로 access token을 발급하면 됩니다.

## 환경 변수

필수 DB/JWT 값은 `.env.example`을 기준으로 채웁니다. `SENTRY_DSN`은 비워두면 Sentry 초기화를 건너뜁니다.
