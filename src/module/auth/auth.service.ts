import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthenticatedUser } from '@src/common/types/authenticated-user';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async signPayload(
        payload: AuthenticatedUser,
    ): Promise<{ accessToken: string }> {
        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}
