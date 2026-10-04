import { ClassType, Mixin } from '@node-yalc/types/globals.js';
import { Field, ObjectType } from '@nestjs/graphql';
import { YalcEntityWithTimestamps } from '@node-yalc/database/timestamp.entity.js';

/**
 * This is a mixin class that can be used to implement the createdAt and updatedAt
 * Database fields in a standardized way
 *
 */
export const EntityWithTimestamps = <T extends ClassType>(base: T) => {
  @ObjectType()
  class EntityWithTimestamps extends YalcEntityWithTimestamps(base) {
    /**
     * DB insert time.
     */
    @Field()
    public createdAt: Date;

    /**
     * DB last update time.
     */
    @Field()
    public updatedAt: Date;
  }

  return EntityWithTimestamps;
};

export type EntityWithTimestamps = Mixin<typeof EntityWithTimestamps>;
