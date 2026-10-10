import {
  InputType,
  Int,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import {
  ModelField,
  ModelObject,
} from '@nest-yalc-2/crud-gen/object.decorator.js';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { assignOmniPublicDto } from './omni-dto.helpers.js';
import { OmniExternalRefInternalType } from './omni-external-ref-internal-type.enum.js';

@ObjectType()
@ModelObject()
export class OmniExternalRefType extends OmniExternalRefEntity {
  constructor(data?: Partial<OmniExternalRefType>) {
    super();
    if (data) {
      assignOmniPublicDto(this, data);
    }
  }

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  @IsUUID()
  override guid!: string;

  @ModelField({ gqlType: returnValue(Int) })
  @IsInt()
  override revision!: number;

  @ModelField({ gqlType: returnValue(OmniExternalRefInternalType) })
  @IsEnum(OmniExternalRefInternalType)
  override internalType!: OmniExternalRefInternalType;

  @ModelField({ gqlType: returnValue(UUIDScalar), isRequired: true })
  @IsUUID()
  override internalId!: string;

  @ModelField({ gqlType: returnValue(String) })
  @IsString()
  @MaxLength(128)
  override provider!: string;

  @ModelField({
    gqlType: returnValue(String),
    gqlOptions: { nullable: true },
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  override account?: string | null;

  @ModelField({
    gqlType: returnValue(String),
    gqlOptions: { nullable: true },
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  override container?: string | null;

  @ModelField({ gqlType: returnValue(String) })
  @IsString()
  @MaxLength(255)
  override externalId!: string;

  @ModelField({
    gqlType: returnValue(GraphQLJSONObject),
    gqlOptions: { nullable: true },
  })
  @IsOptional()
  @IsObject()
  override payload?: Record<string, unknown> | null;

  @ModelField({
    gqlType: returnValue(String),
    gqlOptions: { nullable: true },
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  override payloadSchemaId?: string | null;

  @ModelField({
    gqlType: returnValue(Int),
    gqlOptions: { nullable: true },
  })
  @IsOptional()
  @IsInt()
  override payloadSchemaVersion?: number | null;
}

@InputType()
@ModelObject()
export class OmniExternalRefCreateInput extends OmitType(
  OmniExternalRefType,
  ['createdAt', 'updatedAt', 'revision'] as const,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: OmniExternalRefType })
export class OmniExternalRefCondition extends PartialType(
  OmniExternalRefCreateInput,
  InputType,
) {}

@InputType()
@ModelObject({ copyFrom: OmniExternalRefType })
export class OmniExternalRefUpdateInput extends PartialType(
  OmniExternalRefCreateInput,
  InputType,
) {}
