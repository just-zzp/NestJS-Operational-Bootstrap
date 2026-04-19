import { LocalDate } from '@js-joda/core';
import { plainToClass } from 'class-transformer';

import { TransformToLocalDate } from '@src/common/decorator/transform-to-local-date.decorator';

class TestClass {
    @TransformToLocalDate()
    public test!: LocalDate;
}

describe('TransformToLocalDate', () => {
    it('날짜 문자열을 LocalDate 인스턴스로 변환합니다.', () => {
        const testValue = '2024-05-20';
        const testObject = plainToClass(TestClass, { test: testValue });

        expect(testObject.test).toBeInstanceOf(LocalDate);
    });
});
