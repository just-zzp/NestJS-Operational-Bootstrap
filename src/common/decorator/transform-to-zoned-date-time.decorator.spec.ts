import { ZonedDateTime } from '@js-joda/core';
import { plainToClass } from 'class-transformer';

import { TransformToZonedDateTime } from './transform-to-zoned-date-time.decorator';

class TestClass {
    @TransformToZonedDateTime()
    public test!: ZonedDateTime;
}

describe('TransformToZonedDateTime', () => {
    it('날짜 문자열을 ZonedDateTime 인스턴스로 변환합니다.', () => {
        const testValue = '2024-05-20T00:00:00Z';
        const testObject = plainToClass(TestClass, { test: testValue });

        expect(testObject.test).toBeInstanceOf(ZonedDateTime);
    });
});
