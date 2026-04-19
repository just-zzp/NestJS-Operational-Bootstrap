import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export const entityList: EntityClassOrSchema[] = [];
const repositoryList: Provider[] = [];

@Module({
    imports: [TypeOrmModule.forFeature(entityList)],
    providers: [...repositoryList],
    exports: [...repositoryList],
})
export class EntityModule {}
