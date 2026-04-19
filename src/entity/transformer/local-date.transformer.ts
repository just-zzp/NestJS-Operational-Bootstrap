import type { ValueTransformer } from 'typeorm';

import { LocalDate } from '@js-joda/core';

import { DateTimeUtil } from '@src/util/date-time-util';

export class LocalDateTransformer implements ValueTransformer {
    // entity -> db로 넣을때
    to(entityValue: LocalDate | unknown): Date | unknown {
        if (entityValue instanceof LocalDate) {
            return DateTimeUtil.toDate(entityValue);
        }
        return entityValue;
    }

    // db -> entity로 가져올때
    from(databaseValue: string | unknown): LocalDate | unknown {
        if (typeof databaseValue === 'string') {
            return DateTimeUtil.toLocalDateBy(databaseValue);
        }
        return databaseValue;
    }
}
