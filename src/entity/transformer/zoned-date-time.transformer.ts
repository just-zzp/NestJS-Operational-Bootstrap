import type { ValueTransformer } from 'typeorm';

import { ZonedDateTime } from '@js-joda/core';

import { DateTimeUtil } from '@src/util/date-time-util';

export class ZonedDateTimeTransformer implements ValueTransformer {
    // entity -> db로 넣을때
    to(entityValue: ZonedDateTime | unknown): Date | unknown {
        if (entityValue instanceof ZonedDateTime) {
            return DateTimeUtil.toDate(entityValue);
        }
        return entityValue;
    }

    // db -> entity로 가져올때
    from(databaseValue: Date | unknown): ZonedDateTime | unknown {
        if (databaseValue instanceof Date) {
            return DateTimeUtil.toZonedDateTime(databaseValue);
        }
        return databaseValue;
    }
}
