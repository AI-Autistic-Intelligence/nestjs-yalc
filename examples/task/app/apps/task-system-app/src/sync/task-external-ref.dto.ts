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
import returnValue from '@nest-yalc-2/utils/returnValue';
import { TaskExternalRef } from '@nest-yalc-2/task-system-module/src/task-external-ref.entity';

@ObjectType()
@ModelObject()
export class TaskExternalRefType extends TaskExternalRef {
  constructor(data?: Partial<TaskExternalRefType>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  guid!: string;

  @ModelField({})
  @Field()
  internalType!: string;

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  @Field(() => UUIDScalar)
  internalId!: string;

  @ModelField({})
  @Field()
  provider!: string;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  account?: string | null;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  container?: string | null;

  @ModelField({})
  @Field()
  externalId!: string;
}

@InputType('TaskExternalRefCreateInput')
@ModelObject()
export class TaskExternalRefCreateInput extends OmitType(
  TaskExternalRefType,
  ['createdAt', 'updatedAt'] as const,
  InputType,
) {}

@InputType('TaskExternalRefCondition')
@ModelObject({ copyFrom: TaskExternalRefType })
export class TaskExternalRefCondition extends PartialType(
  TaskExternalRefCreateInput,
  InputType,
) {}

@InputType('TaskExternalRefUpdateInput')
@ModelObject({ copyFrom: TaskExternalRefType })
export class TaskExternalRefUpdateInput extends PartialType(
  TaskExternalRefCreateInput,
  InputType,
) {}
