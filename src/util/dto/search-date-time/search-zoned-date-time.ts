import { ZonedDateTime } from '@js-joda/core';

import { DateTimeUtil } from '@src/util/date-time-util';
import { SearchDateTime } from '@src/util/dto/search-date-time/search-date-time';

export class SearchZonedDateTime extends SearchDateTime<ZonedDateTime> {
    readonly start: ZonedDateTime;
    readonly end: ZonedDateTime;

    constructor(searchZonedDateTimeString: string) {
        super();
        this.validateInput(searchZonedDateTimeString);

        const [start, end] = searchZonedDateTimeString.split('~');
        this.start = DateTimeUtil.toZonedDateTimeBy(start);
        this.end = DateTimeUtil.toZonedDateTimeBy(end);

        this.validateField();
    }
}
