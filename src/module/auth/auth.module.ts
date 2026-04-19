import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { AuthController } from '@src/module/auth/auth.controller';
import { AuthService } from '@src/module/auth/auth.service';
import { AuthGuard } from '@src/module/auth/guard/auth.guard';
import { RolesGuard } from '@src/module/auth/guard/roles.guard';

type JwtSignOptions = NonNullable<JwtModuleOptions['signOptions']>;

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const expiresIn = configService.get<string>(
                    'JWT_EXPIRES_IN',
                    '1d',
                ) as JwtSignOptions['expiresIn'];

                return {
                    global: true,
                    secret: configService.getOrThrow<string>('JWT_SECRET'),
                    signOptions: {
                        expiresIn,
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [AuthService],
})
export class AuthModule {}
