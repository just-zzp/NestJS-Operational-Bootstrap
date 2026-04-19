import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutputDto<Item> {
    @ApiProperty()
    readonly totalCount: number;

    @ApiProperty()
    readonly items: Item[];

    constructor(params: { totalCount: number; items: Item[] }) {
        this.totalCount = params.totalCount;
        this.items = params.items;
    }
}
