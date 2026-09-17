jest.mock('@nestjs/graphql');

import { ExtendedBaseEntity } from '@nest-yalc-2/jest/extended-base-entity.entity';
import { mockQueryBuilder } from '@nest-yalc-2/jest/common-mocks.helper';
import * as ObjectDecorator from '../object.decorator';
import { SelectQueryBuilderPatched } from '../query-builder.helpers';

describe('QueryBuilderHelper', () => {
  let testQb: SelectQueryBuilderPatched<Partial<ExtendedBaseEntity>>;
  const mockedQb = mockQueryBuilder<Partial<ExtendedBaseEntity>>({
    expressionMap: { clone: jest.fn().mockReturnValue({}) } as any,
  });
  beforeEach(() => {
    testQb = new SelectQueryBuilderPatched<Partial<ExtendedBaseEntity>>(
      mockedQb,
    );
  });

  it('getMany works correctly', async () => {
    Reflect.defineMetadata(ObjectDecorator.AGGRID_FIELD_METADATA_KEY, {
        first: {
          mode: 'derived',
          dst: 'something',
        },
        second: {
          mode: 'derived',
        },
        third: {
          mode: 'regular',
          dst: 'something',
        },
    }, Object);

    jest.spyOn(testQb, 'getRawAndEntities').mockResolvedValueOnce({
      entities: [{ first: 'defined', second: 'undefined', third: undefined }],
      raw: [{ first: 'defined', second: 'undefined', third: undefined }],
    });
    let result = await testQb.getMany();
    expect(result).toEqual([
      {
        first: 'defined',
        second: 'undefined',
        third: undefined,
      },
    ]);

    Reflect.deleteMetadata(ObjectDecorator.AGGRID_FIELD_METADATA_KEY, Object);
    jest.spyOn(testQb, 'getRawAndEntities').mockResolvedValueOnce({
      entities: [{ first: 'defined', second: 'undefined', third: undefined }],
      raw: [{ first: 'defined', second: 'undefined', third: undefined }],
    });
    result = await testQb.getMany();
    expect(result).toEqual([
      {
        first: 'defined',
        second: 'undefined',
        third: undefined,
      },
    ]);
  });

  it('getOne works correctly', async () => {
    Reflect.defineMetadata(ObjectDecorator.AGGRID_FIELD_METADATA_KEY, {
        first: {
          mode: 'derived',
          dst: 'something',
        },
        second: {
          mode: 'derived',
        },
        third: {
          mode: 'regular',
          dst: 'something',
        },
    }, Object);

    jest.spyOn(testQb, 'getRawAndEntities').mockResolvedValueOnce({
      entities: [{ first: 'defined', second: 'undefined', third: undefined }],
      raw: [{ first: 'defined', second: 'undefined', third: undefined }],
    });
    let result = await testQb.getOne();
    expect(result).toEqual({
      first: 'defined',
      second: 'undefined',
      third: undefined,
    });

    Reflect.deleteMetadata(ObjectDecorator.AGGRID_FIELD_METADATA_KEY, Object);
    jest.spyOn(testQb, 'getRawAndEntities').mockResolvedValueOnce({
      entities: [{ first: 'defined', second: 'undefined', third: undefined }],
      raw: [{ first: 'defined', second: 'undefined', third: undefined }],
    });
    result = await testQb.getOne();
    expect(result).toEqual({
      first: 'defined',
      second: 'undefined',
      third: undefined,
    });

    jest.spyOn(testQb, 'getRawAndEntities').mockResolvedValueOnce({
      entities: [],
      raw: [],
    });
    result = await testQb.getOne();
    expect(result).toEqual(undefined);
  });
});
