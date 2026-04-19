import type { ValueTransformer } from 'typeorm';

import { LocalDateTime } from '@js-joda/core';

import { DateTimeUtil } from '@src/util/date-time-util';

export class LocalDateTimeTransformer implements ValueTransformer {
    // entity -> db로 넣을때
    to(entityValue: LocalDateTime | unknown): Date | unknown {
        if (entityValue instanceof LocalDateTime) {
            return DateTimeUtil.toDate(entityValue);
        }
        return entityValue;
    }

    // db -> entity로 가져올때
    from(databaseValue: Date | unknown): LocalDateTime | unknown {
        if (databaseValue instanceof Date) {
            return DateTimeUtil.toLocalDateTime(databaseValue);
        }
        return databaseValue;
    }
}
