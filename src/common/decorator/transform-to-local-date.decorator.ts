import { Transform } from 'class-transformer';

import { DateTimeUtil } from '@src/util/date-time-util';

export const TransformToLocalDate = (): PropertyDecorator => {
    return Transform(({ value }) => DateTimeUtil.toLocalDateBy(value));
};
