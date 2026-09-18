import { ClassType, Mixin } from '@nest-yalc-2/types';
import returnValue from '@nest-yalc-2/utils/returnValue';
import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * This is a mixin class that can be used to implement the createdAt and updatedAt
 * Database fields in a standardized way
 *
 */
/* istanbul ignore next */
export const EntityWithTimestamps = <T extends ClassType>(base: T) => {
  /* istanbul ignore next */
  @ObjectType()
  class EntityWithTimestamps extends base {
    /**
     * DB insert time.
     */
    /* istanbul ignore next */
    @CreateDateColumn({
      type: 'timestamp',
      default: returnValue('CURRENT_TIMESTAMP(6)'),
    })
    @Field()
    public createdAt: Date;

    /**
     * DB last update time.
     */
    /* istanbul ignore next */
    @UpdateDateColumn({
      type: 'timestamp',
      default: returnValue('CURRENT_TIMESTAMP(6)'),
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    @Field()
    public updatedAt: Date;
  }

  return EntityWithTimestamps;
};

export type EntityWithTimestamps = Mixin<typeof EntityWithTimestamps>;
