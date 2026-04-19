import { BadRequestException } from '@nestjs/common';

import { DateTimeUtil } from '@src/util/date-time-util';
import { SearchLocalDate } from '@src/util/dto/search-date-time/search-local-date';

describe('SearchLocalDate', () => {
    it('옳바른 local date를 반환 해야합니다.', () => {
        const searchLocalDate = new SearchLocalDate('2021-01-01~2022-01-01');
        expect(searchLocalDate.start).toEqual(
            DateTimeUtil.toLocalDateBy('2021-01-01'),
        );
        expect(searchLocalDate.end).toEqual(
            DateTimeUtil.toLocalDateBy('2022-01-01'),
        );
    });

    it('input이 잘못된 타입이면 에러를 반환합니다.', async () => {
        const result = async (): Promise<SearchLocalDate> =>
            new SearchLocalDate('2021-01-01');

        await expect(result).rejects.toBeInstanceOf(BadRequestException);
        await expect(result).rejects.toThrow(
            'Invalid input string format. Expected format: "start~end"',
        );
    });

    it('start 시간이 end 시간보다 늦으면 에러를 반환합니다.', async () => {
        const result = async (): Promise<SearchLocalDate> =>
            new SearchLocalDate('2022-01-02~2022-01-01');

        await expect(result).rejects.toBeInstanceOf(BadRequestException);
        await expect(result).rejects.toThrow(
            'End date time must be after start date time',
        );
    });
});
