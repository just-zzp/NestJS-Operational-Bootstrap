import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export async function createUnitTestingModule(
    params: Pick<ModuleMetadata, 'controllers' | 'providers' | 'imports'>,
): Promise<TestingModule> {
    return await Test.createTestingModule({
        imports: params.imports ?? [],
        controllers: params.controllers ?? [],
        providers: params.providers ?? [],
    }).compile();
}
