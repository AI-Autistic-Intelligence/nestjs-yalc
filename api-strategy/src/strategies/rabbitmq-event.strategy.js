"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqEventStrategyProvider = exports.RabbitMqEventStrategy = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMqEventStrategy {
    constructor(options) {
        this.options = options;
    }
    emit(path, payload) {
        void this.publish(path, payload).catch(() => undefined);
        return true;
    }
    async emitAsync(path, payload) {
        return this.publish(path, payload);
    }
    async onModuleDestroy() {
        await closeRabbitResource(this.channel);
        await closeRabbitResource(this.connection);
        this.channel = undefined;
        this.connection = undefined;
    }
    async publish(path, payload) {
        const channel = await this.getChannel();
        const body = this.serialize(payload);
        return channel.publish(this.options.exchange, path, body, {
            contentType: this.options.contentType ?? 'application/json',
            persistent: this.options.persistent ?? true,
            ...this.options.publishOptions,
        });
    }
    serialize(payload) {
        const serialized = this.options.serialize?.(payload);
        if (Buffer.isBuffer(serialized)) {
            return serialized;
        }
        return Buffer.from(serialized ?? JSON.stringify(payload));
    }
    async getChannel() {
        if (this.channel) {
            return this.channel;
        }
        this.connection = await amqplib_1.default.connect(this.options.url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(this.options.exchange, this.options.exchangeType ?? 'topic', {
            durable: this.options.durable ?? true,
        });
        return this.channel;
    }
}
exports.RabbitMqEventStrategy = RabbitMqEventStrategy;
const RabbitMqEventStrategyProvider = (provide, options) => ({
    provide,
    useFactory: () => {
        const Strategy = options.RabbitMqStrategy ?? RabbitMqEventStrategy;
        const strategyOptions = typeof options.options === 'function'
            ? options.options()
            : options.options;
        return new Strategy(strategyOptions);
    },
});
exports.RabbitMqEventStrategyProvider = RabbitMqEventStrategyProvider;
async function closeRabbitResource(resource) {
    if (!resource) {
        return;
    }
    let timeout;
    try {
        await Promise.race([
            resource.close(),
            new Promise((resolve) => {
                timeout = setTimeout(resolve, 1000);
            }),
        ]);
    }
    catch (error) {
        if (!(error instanceof Error) || !error.message.includes('closing')) {
            throw error;
        }
    }
    finally {
        if (timeout) {
            clearTimeout(timeout);
        }
        forceCloseRabbitResource(resource);
    }
}
function forceCloseRabbitResource(resource) {
    const connection = resource.connection;
    connection?.heartbeater?.clear();
    resource.heartbeater?.clear();
    connection?.stream?.destroy();
    resource.stream?.destroy();
}
//# sourceMappingURL=rabbitmq-event.strategy.js.map