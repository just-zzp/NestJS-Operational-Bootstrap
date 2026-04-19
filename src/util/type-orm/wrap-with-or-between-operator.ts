import { LocalDate, LocalDateTime, ZonedDateTime } from '@js-joda/core';
import { Between, FindOperator, Or } from 'typeorm';

import { DateTimeUtil } from '@src/util/date-time-util';
import { SearchDateTime } from '@src/util/dto/search-date-time/search-date-time';

export const wrapWithOrBetweenOperator = <
    T extends LocalDate | LocalDateTime | ZonedDateTime,
>(
    searchDateTimeList: SearchDateTime<T>[],
): FindOperator<Date> => {
    return Or(
        ...searchDateTimeList.map((searchDateTime) =>
            Between(
                DateTimeUtil.toDate(searchDateTime.start),
                DateTimeUtil.toDate(searchDateTime.end),
            ),
        ),
    );
};
