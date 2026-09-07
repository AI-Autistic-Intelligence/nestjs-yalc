import { CrudGenResourceFactory } from '@nest-yalc-2/crud-gen';
import { getServiceToken } from '@nest-yalc-2/crud-gen/typeorm/generic.service';
import {
  GQLDataLoader,
  getDataloaderToken,
  getFn,
} from '@nest-yalc-2/data-loader';
import { TaskEvent } from '@nest-yalc-2/task-system-module/src/task-event.entity';
import { bindGeneratedDataloaderEventEmitter } from '../crudgen-provider-compat.js';
import { TaskAppOmniEventService } from '../omni-task-app/task-app-omni-event.service';
import {
  TaskEventCondition,
  TaskEventCreateInput,
  TaskEventType,
  TaskEventUpdateInput,
} from './task-event.dto';

export const taskEventResource = CrudGenResourceFactory<TaskEvent>({
  entityModel: TaskEvent,
  backend: {
    service: {
      provider: {
        provide: getServiceToken(TaskEvent),
        useExisting: TaskAppOmniEventService,
      },
    },
    dataloader: {
      provider: {
        provide: getDataloaderToken(TaskEvent),
        useFactory: (service: TaskAppOmniEventService) =>
          new GQLDataLoader(getFn(service as any), 'guid'),
        inject: [getServiceToken(TaskEvent)],
      },
    },
  },
  graphql: {
    resolver: {
      dto: TaskEventType,
      input: {
        create: TaskEventCreateInput,
        update: TaskEventUpdateInput,
        conditions: TaskEventCondition,
      },
      prefix: 'TaskSystem_',
    },
  },
  rest: {
    dto: TaskEventType,
    path: 'events',
    idField: 'guid',
  },
});

export const EventsController = taskEventResource.controllers[0];
export const taskEventProviders = bindGeneratedDataloaderEventEmitter(
  taskEventResource.providers,
);
