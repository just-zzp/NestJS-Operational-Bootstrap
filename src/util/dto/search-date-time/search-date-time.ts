import { BadRequestException } from '@nestjs/common';

import { LocalDate, LocalDateTime, ZonedDateTime } from '@js-joda/core';

export abstract class SearchDateTime<
    T extends LocalDate | LocalDateTime | ZonedDateTime,
> {
    abstract readonly start: T;
    abstract readonly end: T;

    protected validateInput(input: string): void {
        if (!input.includes('~')) {
            throw new BadRequestException(
                'Invalid input string format. Expected format: "start~end"',
            );
        }
    }

    protected validateField(): void {
        const end = this.end as T & { isBefore(other: T): boolean };
        if (end.isBefore(this.start)) {
            throw new BadRequestException(
                'End date time must be after start date time',
            );
        }
    }
}
