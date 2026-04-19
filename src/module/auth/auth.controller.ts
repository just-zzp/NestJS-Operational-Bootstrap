import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@src/common/decorator/current-user.decorator';
import { ResponseEntity } from '@src/common/response/response-entity';
import { AuthenticatedUser } from '@src/common/types/authenticated-user';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Post('verify-token')
    verifyToken(
        @CurrentUser() user: AuthenticatedUser,
    ): ResponseEntity<AuthenticatedUser> {
        return ResponseEntity.OK_WITH(user);
    }
}
