import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

import { Public } from './common/decorator/public.decorator';

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    constructor() {}

    @Public()
    @Get()
    getHello(): string {
        return 'Hello world!';
    }
}
