import { BadRequestException } from '@nestjs/common';

import { DateTimeUtil } from '@src/util/date-time-util';
import { SearchZonedDateTime } from '@src/util/dto/search-date-time/search-zoned-date-time';

describe('SearchZonedDateTime', () => {
    it('옳바른 zoned date time을 반환 해야합니다.', () => {
        const searchLocalDate = new SearchZonedDateTime(
            '2021-01-01T00:00:00.000Z~2022-01-01T00:00:00.000Z',
        );
        expect(searchLocalDate.start).toEqual(
            DateTimeUtil.toZonedDateTimeBy('2021-01-01T00:00:00.000Z'),
        );
        expect(searchLocalDate.end).toEqual(
            DateTimeUtil.toZonedDateTimeBy('2022-01-01T00:00:00.000Z'),
        );
    });

    it('input이 잘못된 타입이면 에러를 반환합니다.', async () => {
        const result = async (): Promise<SearchZonedDateTime> =>
            new SearchZonedDateTime('2021-01-01T00:00:00.000Z');

        await expect(result).rejects.toBeInstanceOf(BadRequestException);
        await expect(result).rejects.toThrow(
            'Invalid input string format. Expected format: "start~end"',
        );
    });

    it('start 시간이 end 시간보다 늦으면 에러를 반환합니다.', async () => {
        const result = async (): Promise<SearchZonedDateTime> =>
            new SearchZonedDateTime(
                '2022-01-01T10:00:00.000Z~2022-01-01T00:00:00.000Z',
            );

        await expect(result).rejects.toBeInstanceOf(BadRequestException);
        await expect(result).rejects.toThrow(
            'End date time must be after start date time',
        );
    });
});
