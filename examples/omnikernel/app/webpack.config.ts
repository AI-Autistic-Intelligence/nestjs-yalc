/**
 * @file webpack.config.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
const ignoredOptionalModules = new Set([
  '@apollo/gateway',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  '@nestjs/websockets/socket-module',
  'amqp-connection-manager',
  'amqplib',
  'apollo-server-fastify',
  'class-transformer/storage',
  'ioredis',
  'kafkajs',
  'mqtt',
  'nats',
  'ts-morph',
]);

export default (options) => ({
  ...options,
  externals: [
    ...(Array.isArray(options.externals)
      ? options.externals
      : [options.externals].filter(Boolean)),
    ({ request }, callback) => {
      if (ignoredOptionalModules.has(request)) {
        callback(null, `commonjs ${request}`);
        return;
      }

      callback();
    },
  ],
  resolve: {
    ...options.resolve,
    extensionAlias: {
      ...(options.resolve?.extensionAlias ?? {}),
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    },
  },
});
