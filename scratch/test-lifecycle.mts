import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Injectable, Global, Inject } from '@nestjs/common';

@Injectable()
export class AppContextService {
  public initializedApps = new Set<string>();
}

@Global()
@Module({ providers: [AppContextService], exports: [AppContextService] })
export class AppContextModule {}

@Injectable()
export class LifeCycleHandler {
  constructor(@Inject(AppContextService) private readonly appContextService: AppContextService) {
    console.log(`LifeCycleHandler instantiated. initializedApps.has('test1') =`, this.appContextService.initializedApps.has('test1'));
    if (this.appContextService.initializedApps.has('test1')) {
      throw new Error(`Cannot initialize the same app (test1) twice`);
    }
    this.appContextService.initializedApps.add('test1');
  }
}

@Module({
  imports: [AppContextModule],
  providers: [LifeCycleHandler],
})
class TestModule1 {}

async function run() {
  console.log('--- TEST 1 ---');
  const app1 = await NestFactory.create(TestModule1, { logger: false, abortOnError: false });
  await app1.close();

  console.log('--- TEST 2 ---');
  const app2 = await NestFactory.create(TestModule1, { logger: false, abortOnError: false });
  await app2.close();
}

run().catch((err) => {
  console.error("CAUGHT ERROR:", err);
});
