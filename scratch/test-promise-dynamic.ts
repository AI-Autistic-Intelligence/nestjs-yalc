import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class Root {}

async function bootstrap() {
  try {
    const module = {
      module: Root,
      imports: [Promise.resolve({ module: class Dynamic {} })]
    };
    await NestFactory.create(module);
    console.log('Success');
  } catch (e) {
    console.error('Error:', e);
  }
}
bootstrap();
