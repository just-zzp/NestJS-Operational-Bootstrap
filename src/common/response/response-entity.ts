import { ApiProperty } from '@nestjs/swagger';

import { ResponseStatus } from '@src/common/response/response-status.enum';

export class ResponseEntity<T> {
    @ApiProperty()
    readonly statusCode: string;

    @ApiProperty()
    readonly message: string;

    @ApiProperty()
    readonly data: T;

    private constructor(status: ResponseStatus, message: string, data: T) {
        this.statusCode = ResponseStatus[status];
        this.message = message;
        this.data = data;
    }

    static OK(): ResponseEntity<string> {
        return new ResponseEntity<string>(ResponseStatus.OK, '', '');
    }

    static OK_WITH<T>(data: T): ResponseEntity<T> {
        return new ResponseEntity<T>(ResponseStatus.OK, '', data);
    }

    static ERROR(): ResponseEntity<string> {
        return new ResponseEntity<string>(
            ResponseStatus.SERVER_ERROR,
            '서버 에러가 발생했습니다.',
            '',
        );
    }

    static ERROR_WITH(
        message: string,
        code: ResponseStatus = ResponseStatus.SERVER_ERROR,
    ): ResponseEntity<string> {
        return new ResponseEntity<string>(code, message, '');
    }

    static ERROR_WITH_DATA<T>(
        message: string,
        code: ResponseStatus = ResponseStatus.SERVER_ERROR,
        data: T,
    ): ResponseEntity<T> {
        return new ResponseEntity<T>(code, message, data);
    }
}
