import { INestApplicationContext } from '@nestjs/common';
import { FastifyInstance } from 'fastify';
import { BaseAppBootstrap, IGlobalOptions } from './app-bootstrap-base.helper.js';
import { INestCreateOptions } from './app-bootstrap.helper.js';
export declare class StandaloneAppBootstrap<TGlobalOptions extends IGlobalOptions = IGlobalOptions> extends BaseAppBootstrap<INestApplicationContext> {
    constructor(appAlias: string, module: any, options?: TGlobalOptions);
    initApp(options?: {
        createOptions?: INestCreateOptions;
        fastifyInstance?: FastifyInstance;
    }): Promise<this>;
    createApp(_options?: {
        createOptions?: INestCreateOptions;
        fastifyInstance?: FastifyInstance;
    }): Promise<this>;
}
