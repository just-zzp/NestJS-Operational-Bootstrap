import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntToStringInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        return next
            .handle()
            .pipe(map((data: unknown) => this.convertBigIntToString(data)));
    }

    private convertBigIntToString(data: unknown): unknown {
        if (Array.isArray(data)) {
            return data.map((item) => this.convertBigIntToString(item));
        }

        if (typeof data === 'bigint') {
            return data.toString();
        }

        if (data && typeof data === 'object') {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    this.convertBigIntToString(value),
                ]),
            );
        }

        return data;
    }
}
