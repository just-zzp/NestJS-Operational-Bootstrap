import { Transform } from 'class-transformer';

import { DateTimeUtil } from '@src/util/date-time-util';

export const TransformToZonedDateTime = (): PropertyDecorator => {
    return Transform(({ value }) => DateTimeUtil.toZonedDateTimeBy(value));
};
