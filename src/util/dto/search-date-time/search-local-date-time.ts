import { LocalDateTime } from '@js-joda/core';

import { DateTimeUtil } from '@src/util/date-time-util';
import { SearchDateTime } from '@src/util/dto/search-date-time/search-date-time';

export class SearchLocalDateTime extends SearchDateTime<LocalDateTime> {
    readonly start: LocalDateTime;
    readonly end: LocalDateTime;

    constructor(searchLocalDateTimeString: string) {
        super();
        this.validateInput(searchLocalDateTimeString);

        const [start, end] = searchLocalDateTimeString.split('~');
        this.start = DateTimeUtil.toLocalDateTimeBy(start);
        this.end = DateTimeUtil.toLocalDateTimeBy(end);

        this.validateField();
    }
}
