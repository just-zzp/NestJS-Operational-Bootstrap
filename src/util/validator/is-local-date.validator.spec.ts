import { LocalDate } from '@js-joda/core';
import { validate } from 'class-validator';

import { DateTimeUtil } from '@src/util/date-time-util';
import { IsLocalDate } from '@src/util/validator/is-local-date.validator';

describe('IsLocalDate', () => {
    class TestClass {
        @IsLocalDate()
        localDate!: LocalDate | string;
    }

    it('LocalDate는 통과합니다.', async () => {
        const test = new TestClass();
        test.localDate = DateTimeUtil.toLocalDateBy('2024-01-01');

        const errors = await validate(test);

        expect(errors.length).toBe(0);
    });

    it('yyyy-MM-dd의 형태는 통과합니다.', async () => {
        const test = new TestClass();
        test.localDate = '2024-01-01';

        const errors = await validate(test);

        expect(errors.length).toBe(0);
    });

    it('LocalDate로 파싱할 수 없는 문자열은 통과할 수 없습니다.', async () => {
        const test = new TestClass();
        test.localDate = '2024-01';

        const errors = await validate(test);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints?.IsLocalDate).toBe(
            'localDate must be a LocalDate string',
        );
    });
});
