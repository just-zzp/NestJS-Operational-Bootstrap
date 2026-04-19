import { JwtService } from '@nestjs/jwt';

import { AuthenticatedUser } from '@src/common/types/authenticated-user';

export class TestAuth {
    constructor(private readonly jwtService: JwtService) {}

    async createAccessToken(
        payload: AuthenticatedUser = { sub: 'test-user', role: 'ADMIN' },
    ): Promise<string> {
        return await this.jwtService.signAsync(payload);
    }

    bearer(accessToken: string): string {
        return `Bearer ${accessToken}`;
    }
}
