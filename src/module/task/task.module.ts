import { Module } from '@nestjs/common';

import { TaskService } from '@src/module/task/task.service';

@Module({
    providers: [TaskService],
})
export class TaskModule {}
