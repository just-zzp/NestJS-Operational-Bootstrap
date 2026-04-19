import {
    convert,
    DateTimeFormatter,
    DayOfWeek,
    Instant,
    LocalDate,
    LocalDateTime,
    nativeJs,
    YearMonth,
    ZonedDateTime,
    ZoneId,
} from '@js-joda/core';
import '@js-joda/timezone';

export class DateTimeUtil {
    private static readonly DATE_FORMATTER =
        DateTimeFormatter.ofPattern('yyyy-MM-dd');
    private static readonly DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    );

    static toString(
        localDate: LocalDate | LocalDateTime | ZonedDateTime,
    ): string {
        if (localDate instanceof LocalDate) {
            return localDate.format(DateTimeUtil.DATE_FORMATTER);
        }
        return localDate.format(DateTimeUtil.DATE_TIME_FORMATTER);
    }

    static toDate(localDate: LocalDate | LocalDateTime | ZonedDateTime): Date {
        return convert(localDate, ZoneId.UTC).toDate();
    }

    static toLocalDate(date: Date): LocalDate {
        return LocalDate.from(nativeJs(date, ZoneId.UTC));
    }

    static toLocalDateTime(date: Date): LocalDateTime {
        return LocalDateTime.from(nativeJs(date, ZoneId.UTC));
    }

    static toZonedDateTime(date: Date): ZonedDateTime {
        return ZonedDateTime.from(nativeJs(date, ZoneId.UTC));
    }

    static toLocalDateBy(strDate: string): LocalDate {
        return LocalDate.parse(strDate, DateTimeUtil.DATE_FORMATTER);
    }

    static toLocalDateTimeBy(strDate: string): LocalDateTime {
        return LocalDateTime.parse(strDate, DateTimeUtil.DATE_TIME_FORMATTER);
    }

    static toZonedDateTimeBy(strDate: string): ZonedDateTime {
        return ZonedDateTime.parse(strDate);
    }

    static toLocalDateByEpochSecond(epochSecond: number): LocalDate {
        return LocalDate.ofInstant(
            Instant.ofEpochSecond(epochSecond),
            ZoneId.UTC,
        );
    }

    static toLocalDateTimeByEpochSecond(epochSecond: number): LocalDateTime {
        return LocalDateTime.ofInstant(
            Instant.ofEpochSecond(epochSecond),
            ZoneId.UTC,
        );
    }

    static toZonedDateTimeByEpochSecond(epochSecond: number): ZonedDateTime {
        return ZonedDateTime.ofInstant(
            Instant.ofEpochSecond(epochSecond),
            ZoneId.UTC,
        );
    }

    static getSeoulDateTime(): ZonedDateTime {
        return ZonedDateTime.now(ZoneId.of('Asia/Seoul'));
    }

    static toSeoulDateTime(localDateTime: LocalDateTime): ZonedDateTime {
        return ZonedDateTime.of(localDateTime, ZoneId.UTC).withZoneSameInstant(
            ZoneId.of('Asia/Seoul'),
        );
    }

    static toKoreanDayOfWeek(
        dayOfWeek: DayOfWeek,
    ):
        | '월요일'
        | '화요일'
        | '수요일'
        | '목요일'
        | '금요일'
        | '토요일'
        | '일요일' {
        const koreanDayOfWeek = {
            [DayOfWeek.MONDAY.name()]: '월요일',
            [DayOfWeek.TUESDAY.name()]: '화요일',
            [DayOfWeek.WEDNESDAY.name()]: '수요일',
            [DayOfWeek.THURSDAY.name()]: '목요일',
            [DayOfWeek.FRIDAY.name()]: '금요일',
            [DayOfWeek.SATURDAY.name()]: '토요일',
            [DayOfWeek.SUNDAY.name()]: '일요일',
        } as const;

        return koreanDayOfWeek[dayOfWeek.name()];
    }

    static addSeoulTimeZone(dateTimeStr: string): string {
        return dateTimeStr.split(' ').join('T').concat('+09:00');
    }

    static getAllDatesForMonth(year: number, month: number): LocalDate[] {
        if (month < 1 || month > 12) {
            throw new Error('월은 1에서 12 사이의 값이어야 합니다.');
        }

        const yearMonth = YearMonth.of(year, month);
        return Array.from({ length: yearMonth.lengthOfMonth() }, (_, index) =>
            LocalDate.of(year, month, index + 1),
        );
    }
}
