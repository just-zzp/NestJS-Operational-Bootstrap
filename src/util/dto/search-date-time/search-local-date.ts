import { LocalDate } from '@js-joda/core';

import { DateTimeUtil } from '@src/util/date-time-util';
import { SearchDateTime } from '@src/util/dto/search-date-time/search-date-time';

export class SearchLocalDate extends SearchDateTime<LocalDate> {
    readonly start: LocalDate;
    readonly end: LocalDate;

    constructor(searchLocalDateString: string) {
        super();
        this.validateInput(searchLocalDateString);

        const [start, end] = searchLocalDateString.split('~');
        this.start = DateTimeUtil.toLocalDateBy(start);
        this.end = DateTimeUtil.toLocalDateBy(end);

        this.validateField();
    }
}
