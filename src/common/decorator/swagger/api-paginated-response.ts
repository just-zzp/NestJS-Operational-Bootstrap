import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationOutputDto } from '@src/util/dto/pagination-output.dto';

export const ApiPaginatedResponse = <Model extends Type<unknown>>(
    model: Model,
): ReturnType<typeof applyDecorators> => {
    return applyDecorators(
        ApiExtraModels(PaginationOutputDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginationOutputDto) },
                    {
                        properties: {
                            items: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};
