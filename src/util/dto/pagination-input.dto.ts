import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export abstract class PaginationInputDto {
    @ApiProperty({ required: false, default: 0 })
    @IsInt()
    @Type(() => Number)
    page = 0;

    @ApiProperty({ required: false, default: 10 })
    @IsInt()
    @Type(() => Number)
    rowsPerPage = 10;

    get skip(): number {
        return this.page * this.rowsPerPage;
    }

    get take(): number {
        return this.rowsPerPage;
    }
}
