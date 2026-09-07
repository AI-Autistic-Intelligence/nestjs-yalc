import { CrudGenResourceFactory } from '@nest-yalc-2/crud-gen';
import { getServiceToken } from '@nest-yalc-2/crud-gen/typeorm/generic.service';
import {
  GQLDataLoader,
  getDataloaderToken,
  getFn,
} from '@nest-yalc-2/data-loader';
import { TaskExternalRef } from '@nest-yalc-2/task-system-module/src/task-external-ref.entity';
import { bindGeneratedDataloaderEventEmitter } from '../crudgen-provider-compat.js';
import { TaskAppOmniExternalRefService } from '../omni-task-app/task-app-omni-external-ref.service';
import {
  TaskExternalRefCondition,
  TaskExternalRefCreateInput,
  TaskExternalRefType,
  TaskExternalRefUpdateInput,
} from './task-external-ref.dto';

export const taskExternalRefResource = CrudGenResourceFactory<TaskExternalRef>({
  entityModel: TaskExternalRef,
  backend: {
    service: {
      provider: {
        provide: getServiceToken(TaskExternalRef),
        useExisting: TaskAppOmniExternalRefService,
      },
    },
    dataloader: {
      provider: {
        provide: getDataloaderToken(TaskExternalRef),
        useFactory: (service: TaskAppOmniExternalRefService) =>
          new GQLDataLoader(getFn(service as any), 'guid'),
        inject: [getServiceToken(TaskExternalRef)],
      },
    },
  },
  graphql: {
    resolver: {
      dto: TaskExternalRefType,
      input: {
        create: TaskExternalRefCreateInput,
        update: TaskExternalRefUpdateInput,
        conditions: TaskExternalRefCondition,
      },
      prefix: 'TaskSystem_',
    },
  },
  rest: {
    dto: TaskExternalRefType,
    path: 'external-refs',
    idField: 'guid',
  },
});

export const ExternalRefsController = taskExternalRefResource.controllers[0];
export const taskExternalRefProviders = bindGeneratedDataloaderEventEmitter(
  taskExternalRefResource.providers,
);
