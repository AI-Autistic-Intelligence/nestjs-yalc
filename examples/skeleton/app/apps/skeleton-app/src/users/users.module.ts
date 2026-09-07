import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpAdapterHost } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SkeletonUser,
  USERS_CLIENT_API_STRATEGY,
  USERS_CLIENT_HTTP_API_STRATEGY,
  USERS_CLIENT_LOCAL_API_STRATEGY,
  UsersApiClient,
} from '@nest-yalc-2/skeleton-module';
import { UsersController, usersResourceProviders } from './users.resource';
import { UsersErrorsController } from './users.errors.controller';
import { UsersClientController } from './users-client.controller';
import { UsersLoggingController } from './users.logging.controller';
import { UsersValidationController } from './users.validation.controller';
import type { AppConfigService } from '@nest-yalc-2/app/app-config.service.js';
import {
  YalcClsModule,
  YalcGlobalClsService,
} from '@nest-yalc-2/app/cls.module.js';
import {
  ApiCallStrategySelectorProvider,
  NestHttpCallStrategy,
  NestLocalCallStrategy,
} from '@nest-yalc-2/api-strategy';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from '@nest-yalc-2/event-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkeletonUser], 'default'),
    HttpModule,
    YalcClsModule,
    EventEmitterModule.forRoot(),
    EventModule.forRootAsync(),
  ],
  controllers: [
    UsersController,
    UsersErrorsController,
    UsersClientController,
    UsersLoggingController,
    UsersValidationController,
  ],
  providers: [
    ...usersResourceProviders,
    UsersApiClient,
    {
      provide: USERS_CLIENT_LOCAL_API_STRATEGY,
      useFactory: (
        httpAdapterHost: HttpAdapterHost,
        clsService: YalcGlobalClsService,
      ) => {
        const configService = {
          values: {},
        } as AppConfigService<{ internalRequestToken?: string }>;

        return new NestLocalCallStrategy(
          httpAdapterHost,
          clsService,
          configService,
        );
      },
      inject: [HttpAdapterHost, YalcGlobalClsService],
    },
    {
      provide: USERS_CLIENT_HTTP_API_STRATEGY,
      useFactory: (
        httpService: HttpService,
        clsService: YalcGlobalClsService,
      ) => {
        const baseUrl =
          process.env.USERS_HTTP_BASE_URL?.trim() ||
          process.env.SKELETON_BASE_URL?.trim() ||
          'http://127.0.0.1:3000';

        return new NestHttpCallStrategy(httpService, clsService, baseUrl);
      },
      inject: [HttpService, YalcGlobalClsService],
    },
    ApiCallStrategySelectorProvider({
      provide: USERS_CLIENT_API_STRATEGY,
      defaultStrategy: 'http',
      strategies: {
        local: USERS_CLIENT_LOCAL_API_STRATEGY,
        http: USERS_CLIENT_HTTP_API_STRATEGY,
      },
      selector: {
        useFactory: () => process.env.USERS_API_STRATEGY,
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
