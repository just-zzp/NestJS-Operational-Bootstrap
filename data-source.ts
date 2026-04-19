import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { entityList } from '@src/entity/entity.module';
import { migrations } from '@src/entity/migrations';

dotenv.config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [...entityList],
    migrations: [...migrations],
    migrationsRun: false,
    logging: process.env.DB_LOGGING === 'true',
    ssl: ['production', 'development'].includes(process.env.NODE_ENV ?? 'local')
        ? { rejectUnauthorized: false }
        : false,
});
