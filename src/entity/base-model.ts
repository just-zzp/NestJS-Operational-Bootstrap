import { ZonedDateTime } from '@js-joda/core';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ZonedDateTimeTransformer } from '@src/entity/transformer/zoned-date-time.transformer';

export abstract class BaseModel<Id = number> {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: Id;

    @CreateDateColumn({
        type: 'timestamptz',
        transformer: new ZonedDateTimeTransformer(),
        update: false,
    })
    createdAt!: ZonedDateTime;

    @UpdateDateColumn({
        type: 'timestamptz',
        transformer: new ZonedDateTimeTransformer(),
        update: false,
    })
    updatedAt!: ZonedDateTime;
}
