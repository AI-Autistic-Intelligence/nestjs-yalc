import { ClassType } from '@nest-yalc-2/types';
import {
  Field,
  HideField,
  InputType,
  IntersectionType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  agQueryParamsNoPaginationFactory,
  AgQueryParams,
} from './ag-grid.args';
import {
  entityFieldsEnumFactory,
  FilterType,
  GeneralFilters,
  Operators,
  SortDirection,
} from './ag-grid.enum';
import {
  DateFilterModel,
  FilterInput,
  FilterExpressionsProperty,
  NumberFilterModel,
  SetFilterModel,
  TextFilterModel,
} from './ag-grid.interface';
import { getEntityRelations } from './ag-grid-metadata.helper';

export interface SortModel<T = any> {
  colId: keyof T | string;
  sort?: SortDirection;
}

export interface SortModelString<T = any> extends SortModel<T> {
  colId: string;
}

export interface SortModelStrict<T> extends SortModel<T> {
  colId: keyof T;
}

/**
 * @deprecated
 */
@InputType()
export class SortModel<T = any> implements SortModel<T> {
  colId!: keyof T | string;
  /* istanbul ignore next */
  @Field(
    /* istanbul ignore next */
    () => SortDirection,
    { nullable: true, defaultValue: 'ASC' },
  )
  sort?: SortDirection;
}

const sortModelCacheMap = new WeakMap();
export function sortModelFactory<Entity>(entityModel: ClassType<Entity>) {
  const cached = sortModelCacheMap.get(entityModel);
  if (cached) return cached;

  const fieldsEnum = entityFieldsEnumFactory(entityModel);
  @InputType(`${entityModel.name}SortModel`)
  class SortModel implements SortModelStrict<typeof fieldsEnum> {
    @Field(
      /* istanbul ignore next */
      () => fieldsEnum,
    )
    colId!: keyof typeof fieldsEnum;
    /* istanbul ignore next */
    @Field(
      /* istanbul ignore next */
      () => SortDirection,
      { nullable: true, defaultValue: 'ASC' },
    )
    sort?: SortDirection;
  }

  sortModelCacheMap.set(entityModel, SortModel);

  return SortModel;
}

@InputType()
export class RowGroup {
  colId!: string;
  aggFunc!: string;
}

const filterExpressionInputCache = new WeakMap();
/* istanbul ignore next */
export function filterExpressionInputFactory<Entity>(
  entityModel: ClassType<Entity>,
) {
  let cached;
  if ((cached = filterExpressionInputCache.get(entityModel))) return cached;

  const FieldEnum = entityFieldsEnumFactory(entityModel);

  @InputType(`${entityModel.name}FilterTextInput`)
  /* istanbul ignore next */
  class FilterText implements TextFilterModel {
    @HideField()
    filterType: FilterType.TEXT;
    @Field(
      /* istanbul ignore next */
      () => GeneralFilters,
    )
    type: GeneralFilters;
    @Field(
      /* istanbul ignore next */
      () => FieldEnum,
    )
    field: string;
    @Field()
    filter: string;
  }

  @InputType(`${entityModel.name}FilterNumberInput`)
  /* istanbul ignore next */
  class FilterNumber implements NumberFilterModel {
    @HideField()
    filterType: FilterType.NUMBER;
    @Field(
      /* istanbul ignore next */
      () => GeneralFilters,
    )
    type: GeneralFilters;
    @Field(
      /* istanbul ignore next */
      () => FieldEnum,
    )
    field: string;
    @Field()
    filter: number;
    @Field({ nullable: true })
    filterTo?: number;
  }

  @InputType(`${entityModel.name}FilterDateInput`)
  /* istanbul ignore next */
  class FilterDate implements DateFilterModel {
    @HideField()
    filterType: FilterType.DATE;
    @Field(
      /* istanbul ignore next */
      () => GeneralFilters,
    )
    type: GeneralFilters;
    @Field(
      /* istanbul ignore next */
      () => FieldEnum,
    )
    field: string;
    @Field()
    dateFrom: string;
    @Field({ nullable: true })
    dateTo?: string;
  }

  @InputType(`${entityModel.name}FilterSetInput`)
  /* istanbul ignore next */
  class FilterSet implements SetFilterModel {
    @HideField()
    filterType: FilterType.SET;
    @Field(
      /* istanbul ignore next */
      () => [String],
    )
    values: string[];
    @Field(
      /* istanbul ignore next */
      () => FieldEnum,
    )
    field: string;
  }

  /**
   * Since union for input types are not possible yet, we need this type
   * @see https://github.com/graphql/graphql-spec/issues/488
   */
  @InputType(`${entityModel.name}FilterInput`)
  /* istanbul ignore next */
  class FilterExpressionProperty implements FilterExpressionsProperty {
    @Field(
      /* istanbul ignore next */
      () => FilterText,
      { nullable: true },
    )
    [FilterType.TEXT]: FilterText;
    @Field(
      /* istanbul ignore next */
      () => FilterNumber,
      { nullable: true },
    )
    [FilterType.NUMBER]: FilterNumber;
    @Field(
      /* istanbul ignore next */
      () => FilterDate,
      { nullable: true },
    )
    [FilterType.DATE]: FilterDate;
    @Field(
      /* istanbul ignore next */
      () => FilterSet,
      { nullable: true },
    )
    [FilterType.SET]: FilterSet;
  }

  @InputType(`${entityModel.name}FilterExpressionInput`)
  /* istanbul ignore next */
  class FilterExpression implements FilterInput {
    @Field(
      /* istanbul ignore next */
      () => Operators,
      { defaultValue: Operators.AND, nullable: true },
    )
    operator?: Operators;
    @Field(
      /* istanbul ignore next */
      () => [FilterExpressionProperty],
    )
    expressions?: FilterExpressionProperty[];
    @Field(
      /* istanbul ignore next */
      () => [FilterExpression],
    )
    childExpressions?: FilterInput[];
  }

  filterExpressionInputCache.set(entityModel, FilterExpression);

  return FilterExpression;
}

export enum JoinTypes {
  LEFT_JOIN,
  INNER_JOIN,
}

export interface JoinArgOptions extends AgQueryParams {
  joinType?: JoinTypes;
}

// memoize pre-generated InputType
const JoinOptionInputCache = new WeakMap();
export function agJoinArgFactory<Entity>(
  entityModel: ClassType<Entity>,
  defaultValues?: AgQueryParams,
) {
  // return memoized result if any
  const cached = JoinOptionInputCache.get(entityModel);
  if (cached) return cached;

  const resolverInfoList = getEntityRelations(entityModel);

  if (!resolverInfoList.length) return null;

  @InputType(`${entityModel.name}JoinInputTypePartial`)
  class JoinInput {
    @Field(
      /* istanbul ignore next */
      () => JoinTypes,
    )
    joinType?: JoinTypes;
  }

  registerEnumType(JoinTypes, {
    name: `JoinTypes`,
  });

  @InputType(`${entityModel.name}JoinOptionsInputType`)
  class JoinOptionInput {
    [index: string]: ClassType;
  }

  resolverInfoList.forEach((r) => {
    const type = r.relation.type;
    /* istanbul ignore next */
    if (typeof type !== 'string') {
      let typeClass: any;
      try {
        typeClass = typeof type === 'function' ? (type as any)() : type;
      } catch {
        /* istanbul ignore next */
        typeClass = type;
      }
      @InputType(`${entityModel.name}${r.relation.propertyName}JoinInputType`)
      class JoinFullInput extends IntersectionType(
        JoinInput,
        agQueryParamsNoPaginationFactory(defaultValues, typeClass),
      ) {}

      JoinOptionInput.prototype[r.relation.propertyName] = JoinFullInput;
      Field(
        /* istanbul ignore next */
        () => JoinFullInput,
        { nullable: true },
      )(JoinOptionInput.prototype, r.relation.propertyName);
    }
  });

  JoinOptionInputCache.set(entityModel, JoinOptionInput);

  return JoinOptionInput;
}
