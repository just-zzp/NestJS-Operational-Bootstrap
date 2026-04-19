import { Module } from '@nestjs/common';

import { AuthModule } from '@src/module/auth/auth.module';
import { HealthModule } from '@src/module/health/health.module';
import { TaskModule } from '@src/module/task/task.module';

@Module({
    imports: [AuthModule, HealthModule, TaskModule],
})
export class CoreModule {}
