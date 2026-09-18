import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import {
  ModelField,
  ModelObject,
} from '@nest-yalc-2/crud-gen/object.decorator.js';
import returnValue from '@node-yalc/utils/returnValue';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import { TaskSyncState } from './task-sync-state.entity.js';

@ObjectType()
@ModelObject()
export class TaskSyncStateType extends TaskSyncState {
  constructor(data?: Partial<TaskSyncStateType>) {
    super();
    if (data) Object.assign(this, data);
  }

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  guid: string;

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  @Field(() => UUIDScalar)
  externalRefId: string;

  @ModelField({})
  @Field()
  status: string;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  lastSyncedAt?: Date | null;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  lastDirection?: string | null;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  remoteVersion?: string | null;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  localVersionHash?: string | null;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  lastError?: string | null;
}

@InputType()
@ModelObject()
export class TaskSyncStateCreateInput extends OmitType(
  TaskSyncStateType,
  ['createdAt', 'updatedAt'] as const,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: TaskSyncStateType })
export class TaskSyncStateCondition extends PartialType(
  TaskSyncStateCreateInput,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: TaskSyncStateType })
export class TaskSyncStateUpdateInput extends PartialType(
  TaskSyncStateCreateInput,
  InputType,
) {}
