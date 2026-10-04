/**
 * @file webpack.config.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import TsconfigPathsPlugin  from 'tsconfig-paths-webpack-plugin';
import nodeExternals  from 'webpack-node-externals';
import webpack  from 'webpack';

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
    nodeExternals({
      allowlist: [/^@nest-yalc-2\//],
    }),
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
    plugins: [
      ...(options.resolve?.plugins ?? []),
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        extensions: ['.ts', '.js', '.mjs', '.cjs'],
      }),
    ],
    extensionAlias: {
      ...(options.resolve?.extensionAlias ?? {}),
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    },
  },
  plugins: [
    ...(options.plugins ?? []),
    new webpack.NormalModuleReplacementPlugin(
      /^@nest-yalc-2\/.*\.js$/,
      (resource) => {
        resource.request = resource.request.replace(/\.js$/, '');
      },
    ),
  ],
});
