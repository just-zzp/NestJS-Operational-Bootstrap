import { ZonedDateTime } from '@js-joda/core';
import { validate } from 'class-validator';

import { IsZonedDateTime } from '@src/util/validator/is-zoned-date-time.validator';

class TestClass {
    @IsZonedDateTime()
    public field!: ZonedDateTime | string;
}

describe('IsZonedDateTime', () => {
    it('유효한 ZonedDateTime 문자열을 검증해야 합니다.', async () => {
        const instance = new TestClass();
        instance.field = ZonedDateTime.now().toString();

        const validationErrors = await validate(instance);

        expect(validationErrors.length).toBe(0);
    });

    it('ZonedDateTime을 검증해야 합니다.', async () => {
        const instance = new TestClass();
        instance.field = ZonedDateTime.now();

        const validationErrors = await validate(instance);

        expect(validationErrors.length).toBe(0);
    });

    it('잘못된 ZonedDateTime 문자열을 검증해서는 안 됩니다.', async () => {
        const instance = new TestClass();
        instance.field = 'invalid_date';

        const validationErrors = await validate(instance);

        expect(validationErrors.length).toBeGreaterThan(0);
    });
});
