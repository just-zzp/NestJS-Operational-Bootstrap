import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import {
    LocalDate,
    LocalDateTime,
    LocalTime,
    ZonedDateTime,
} from '@js-joda/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DateTimeUtil } from '@src/util/date-time-util';

@Injectable()
export class JsJodaToStringInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        return next
            .handle()
            .pipe(map((data: unknown) => this.convertJsJodaToString(data)));
    }

    private convertJsJodaToString(data: unknown): unknown {
        if (Array.isArray(data)) {
            return data.map((item) => this.convertJsJodaToString(item));
        }

        if (data instanceof LocalDate) {
            return DateTimeUtil.toString(data);
        }

        if (data instanceof LocalTime) {
            return data.toString();
        }

        if (data instanceof LocalDateTime) {
            return DateTimeUtil.toString(data);
        }

        if (data instanceof ZonedDateTime) {
            return DateTimeUtil.toString(data);
        }

        if (data instanceof Date) {
            return data.toISOString();
        }

        if (data && typeof data === 'object') {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    this.convertJsJodaToString(value),
                ]),
            );
        }

        return data;
    }
}
