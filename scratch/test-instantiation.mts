import { NestFactory } from '@nestjs/core';
import { Module, DynamicModule } from '@nestjs/common';

class LifeCycleHandler {
  constructor() {
    console.log('LifeCycleHandler INSTANTIATED');
  }
}

import { ConfigModule } from '@nestjs/config';

function yalcBaseAppModuleMetadataFactory(): DynamicModule {
  return {
    module: class {}, 
    imports: [ConfigModule.forRoot({})],
    providers: [LifeCycleHandler],
  } as any;
}

@Module({
  imports: [ConfigModule.forRoot({})],
  providers: [LifeCycleHandler], 
})
class TestModule1 {}

@Module({})
class YalcDefaultAppModule {
  static forRoot(imports: any[]): DynamicModule {
    return {
      module: YalcDefaultAppModule,
      imports: [...imports],
    };
  }
}

async function bootstrap() {
  const dynamicModule = YalcDefaultAppModule.forRoot([TestModule1]);
  const app = await NestFactory.create(dynamicModule);
  await app.init();
}

bootstrap().catch(console.error);
