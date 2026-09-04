import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({
  imports: [Promise.resolve({ module: class Dynamic {} })]
})
class Root {}

async function bootstrap() {
  try {
    await NestFactory.create(Root);
    console.log('Success');
  } catch (e) {
    console.error('Error:', e);
  }
}
bootstrap();
