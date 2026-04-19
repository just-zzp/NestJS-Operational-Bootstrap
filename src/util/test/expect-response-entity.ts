import { ResponseStatus } from '@src/common/response/response-status.enum';

export function expectOkResponseEntity<T>(data: T): {
    statusCode: ResponseStatus.OK;
    message: '';
    data: T;
} {
    return {
        statusCode: ResponseStatus.OK,
        message: '',
        data,
    };
}
