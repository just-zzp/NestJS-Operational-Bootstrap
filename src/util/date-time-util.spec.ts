import { DateTimeUtil } from '@src/util/date-time-util';

describe('DateTimeUtil', () => {
    describe('toLocalDateByEpochSecond', () => {
        it('초단위의 epoch time으로 LocalDate를 생성할 수 있어야합니다.', () => {
            const epochSecond =
                new Date('2024-08-02 09:00:00').getTime() / 1000;

            const result = DateTimeUtil.toLocalDateByEpochSecond(epochSecond);

            expect(result).toEqual(DateTimeUtil.toLocalDateBy('2024-08-02'));
        });
    });

    describe('toLocalDateTimeByEpochSecond', () => {
        it('초단위의 epoch time으로 LocalDateTime을 생성할 수 있어야합니다.', () => {
            const epochSecond =
                new Date('2024-08-02T09:00:00.000Z').getTime() / 1000;

            const result =
                DateTimeUtil.toLocalDateTimeByEpochSecond(epochSecond);

            expect(result).toEqual(
                DateTimeUtil.toLocalDateTimeBy('2024-08-02T09:00:00.000Z'),
            );
        });
    });

    describe('toZonedDateTimeByEpochSecond', () => {
        it('초단위의 epoch time으로 ZonedDateTime을 생성할 수 있어야합니다.', () => {
            const epochSecond =
                new Date('2024-08-02T09:00:00.000Z').getTime() / 1000;

            const result =
                DateTimeUtil.toZonedDateTimeByEpochSecond(epochSecond);

            expect(result).toEqual(
                DateTimeUtil.toZonedDateTimeBy('2024-08-02T09:00:00.000Z'),
            );
        });
    });
    describe('getAllDatesForMonth', () => {
        it.each([
            [2026, 1, 31],
            [2024, 2, 29],
            [2026, 2, 28],
        ])('%s년 %s월은 날이 %s까지 있다.', (year, month, length) => {
            const result = DateTimeUtil.getAllDatesForMonth(year, month);

            expect(result.length).toBe(length);
        });
    });
});
