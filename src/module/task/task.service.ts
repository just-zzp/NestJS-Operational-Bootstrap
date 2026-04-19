import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    logSkippedTask(taskName: string): void {
        this.logger.log(`Skip task: ${taskName}`);
    }
}
