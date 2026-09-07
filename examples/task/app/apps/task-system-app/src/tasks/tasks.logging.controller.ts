import { Controller, Get } from '@nestjs/common';
import { YalcEventService } from '@nest-yalc-2/event-manager';

@Controller('tasks-logging')
export class TasksLoggingController {
  constructor(private readonly events: YalcEventService) {}

  @Get()
  async logTaskEvent() {
    await this.events.log(['tasks', 'logging', 'demo'], {
      data: { ok: true },
      event: { await: true },
    });

    return { ok: true };
  }
}
