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
} from '@nest-yalc-2/crud-gen/object.decorator';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar';
import returnValue from '@node-yalc/utils/returnValue.js';
import { TaskEvent } from '@nest-yalc-2/task-system-module/src/task-event.entity';

@ObjectType()
@ModelObject()
export class TaskEventType extends TaskEvent {
  constructor(data?: Partial<TaskEventType>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  @Field(() => UUIDScalar)
  guid!: string;

  @ModelField({ gqlType: () => String })
  @Field(() => String)
  title!: string;

  @ModelField({ gqlType: () => String, gqlOptions: { nullable: true } })
  @Field(() => String, { nullable: true })
  description?: string | null;

  @ModelField({ gqlType: () => String })
  @Field(() => String)
  status!: string;

  @ModelField({ gqlType: () => Date })
  @Field(() => Date)
  startAt!: Date;

  @ModelField({ gqlType: () => Date, gqlOptions: { nullable: true } })
  @Field(() => Date, { nullable: true })
  endAt?: Date | null;

  @ModelField({ gqlType: () => Boolean })
  @Field(() => Boolean)
  allDay!: boolean;

  @ModelField({
    gqlType: returnValue(UUIDScalar),
    gqlOptions: { nullable: true },
  })
  @Field(() => UUIDScalar, { nullable: true })
  projectId?: string | null;

  @ModelField({ gqlType: () => String, gqlOptions: { nullable: true } })
  @Field(() => String, { nullable: true })
  location?: string | null;
}

@InputType()
@ModelObject()
export class TaskEventCreateInput extends OmitType(
  TaskEventType,
  ['createdAt', 'updatedAt'] as const,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: TaskEventType })
export class TaskEventCondition extends PartialType(
  TaskEventCreateInput,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: TaskEventType })
export class TaskEventUpdateInput extends PartialType(
  TaskEventCreateInput,
  InputType,
) {}
