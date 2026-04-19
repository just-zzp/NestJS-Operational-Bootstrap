import { ConfigService } from '@nestjs/config';

import { ZonedDateTime } from '@js-joda/core';
import dotenv from 'dotenv';
import { Column, DataSource, Entity, Repository } from 'typeorm';

import { BaseModel } from '@src/entity/base-model';

dotenv.config();

@Entity()
class TestClass extends BaseModel<number> {
    @Column()
    name: string;

    constructor(name = 'test') {
        super();
        this.name = name;
    }
}

describe('BaseModel', () => {
    let dataSource: DataSource;
    let repository: Repository<TestClass>;

    beforeAll(async () => {
        const configService = new ConfigService();
        dataSource = new DataSource({
            type: 'postgres',
            host: configService.getOrThrow<string>('DB_HOST'),
            port: configService.getOrThrow<number>('DB_PORT'),
            username: configService.getOrThrow<string>('DB_USERNAME'),
            password: configService.getOrThrow<string>('DB_PASSWORD'),
            database: configService.getOrThrow<string>('DB_DATABASE'),
            entities: [TestClass],
        });
        await dataSource.initialize();
        repository = dataSource.getRepository(TestClass);
    });

    beforeEach(async () => {
        await dataSource.synchronize(true);
    });

    afterAll(async () => {
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    describe('저장', () => {
        it('createdAt, updatedAt을 ZonedDateTime으로 생성해야 합니다.', async () => {
            await repository.save(new TestClass());

            const entity = await repository.findOneOrFail({ where: { id: 1 } });

            expect(entity.createdAt).toBeInstanceOf(ZonedDateTime);
            expect(entity.updatedAt).toBeInstanceOf(ZonedDateTime);
        });
    });
});
