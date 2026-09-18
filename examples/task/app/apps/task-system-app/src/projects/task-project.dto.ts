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
import returnValue from '@node-yalc/utils/returnValue';
import { TaskProject } from '@nest-yalc-2/task-system-module/src/task-project.entity';

@ObjectType()
@ModelObject()
export class TaskProjectType extends TaskProject {
  constructor(data?: Partial<TaskProjectType>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  @Field(() => UUIDScalar)
  guid!: string;

  @ModelField({})
  @Field()
  name!: string;

  @ModelField({ gqlOptions: { nullable: true } })
  @Field({ nullable: true })
  description?: string | null;

  @ModelField({})
  @Field()
  status!: string;
}

@InputType()
@ModelObject()
export class TaskProjectCreateInput extends OmitType(
  TaskProjectType,
  ['createdAt', 'updatedAt'] as const,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: TaskProjectType })
export class TaskProjectCondition extends PartialType(
  TaskProjectCreateInput,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: TaskProjectType })
export class TaskProjectUpdateInput extends PartialType(
  TaskProjectCreateInput,
  InputType,
) {}
