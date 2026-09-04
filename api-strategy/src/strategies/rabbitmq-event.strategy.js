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
        var _a, _b;
        const channel = await this.getChannel();
        const body = this.serialize(payload);
        return channel.publish(this.options.exchange, path, body, Object.assign({ contentType: (_a = this.options.contentType) !== null && _a !== void 0 ? _a : 'application/json', persistent: (_b = this.options.persistent) !== null && _b !== void 0 ? _b : true }, this.options.publishOptions));
    }
    serialize(payload) {
        var _a, _b;
        const serialized = (_b = (_a = this.options).serialize) === null || _b === void 0 ? void 0 : _b.call(_a, payload);
        if (Buffer.isBuffer(serialized)) {
            return serialized;
        }
        return Buffer.from(serialized !== null && serialized !== void 0 ? serialized : JSON.stringify(payload));
    }
    async getChannel() {
        var _a, _b;
        if (this.channel) {
            return this.channel;
        }
        this.connection = await amqplib_1.default.connect(this.options.url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(this.options.exchange, (_a = this.options.exchangeType) !== null && _a !== void 0 ? _a : 'topic', {
            durable: (_b = this.options.durable) !== null && _b !== void 0 ? _b : true,
        });
        return this.channel;
    }
}
exports.RabbitMqEventStrategy = RabbitMqEventStrategy;
const RabbitMqEventStrategyProvider = (provide, options) => ({
    provide,
    useFactory: () => {
        var _a;
        const Strategy = (_a = options.RabbitMqStrategy) !== null && _a !== void 0 ? _a : RabbitMqEventStrategy;
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
    var _a, _b, _c, _d;
    const connection = resource.connection;
    (_a = connection === null || connection === void 0 ? void 0 : connection.heartbeater) === null || _a === void 0 ? void 0 : _a.clear();
    (_b = resource.heartbeater) === null || _b === void 0 ? void 0 : _b.clear();
    (_c = connection === null || connection === void 0 ? void 0 : connection.stream) === null || _c === void 0 ? void 0 : _c.destroy();
    (_d = resource.stream) === null || _d === void 0 ? void 0 : _d.destroy();
}
//# sourceMappingURL=rabbitmq-event.strategy.js.map