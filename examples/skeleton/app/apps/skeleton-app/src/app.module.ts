import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkeletonPhone } from '@nest-yalc-2/skeleton-module/src/skeleton-phone.entity';
import { SkeletonUser } from '@nest-yalc-2/skeleton-module/src/skeleton-user.entity';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar';
import { HttpExceptionFilter } from '@nest-yalc-2/errors/filters/http-exception.filter.js';
import { AppLoggerFactory } from '@node-yalc/logger';
import { PhonesModule } from './phones/phones.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [SkeletonUser, SkeletonPhone],
      synchronize: true,
    }),
    UsersModule,
    PhonesModule,
  ],
  providers: [
    UUIDScalar,
    {
      provide: APP_FILTER,
      useFactory: () => new HttpExceptionFilter(AppLoggerFactory('SkeletonApp')),
    },
  ],
})
export class AppModule {}
