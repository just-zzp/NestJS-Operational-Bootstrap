import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@src/common/decorator/public.decorator';
import { ResponseEntity } from '@src/common/response/response-entity';

@ApiTags('health')
@Controller({
    path: 'health',
    version: VERSION_NEUTRAL,
})
export class HealthController {
    @Public()
    @Get()
    getHealth(): ResponseEntity<{ status: 'ok' }> {
        return ResponseEntity.OK_WITH({ status: 'ok' });
    }
}
