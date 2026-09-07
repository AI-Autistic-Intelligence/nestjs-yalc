# @nest-yalc-2/event-manager

Structured event, logging, and HTTP-aware error helpers for NestJS
applications.

`YalcEventService` is the usual application entry point. It wraps lower-level
event helpers so one call can log, emit through `EventEmitter2`, and create
typed errors from `@nest-yalc-2/errors`.

## Installation

```bash
npm install @nest-yalc-2/event-manager
```

## Main Exports

- `YalcEventService` for logs, domain events, and error helpers.
- `EventModule` for Nest provider wiring.
- `event`, `eventAsync`, and level-specific event helpers.
- `simpleDotFormatter`, global emitter helpers, and Result helper types.

## Example

```ts
import { EventModule, YalcEventService } from '@nest-yalc-2/event-manager';

@Module({
  imports: [EventModule.forRootAsync({})],
})
export class AppModule {}

@Injectable()
export class UsersService {
  constructor(private readonly events: YalcEventService) {}

  async loaded(userId: string) {
    await this.events.logAsync(['user', 'loaded'], {
      data: { userId },
    });
  }
}
```

## Documentation

- EventManager module:
  https://github.com/Nek97/nestjs-yalc/blob/dev/docs/event-manager-module.md
- YalcEventService:
  https://github.com/Nek97/nestjs-yalc/blob/dev/docs/event-manager-service.md
- Event helper:
  https://github.com/Nek97/nestjs-yalc/blob/dev/docs/event-manager-event.md
