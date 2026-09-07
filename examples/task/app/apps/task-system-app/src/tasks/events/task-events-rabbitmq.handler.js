"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEventsRabbitMqHandler = void 0;
const common_1 = require("@nestjs/common");
const tasks_events_client_1 = require("@nest-yalc-2/task-system-module/src/events/tasks-events.client");
const amqplib_1 = __importDefault(require("amqplib"));
const task_events_audit_store_1 = require("./task-events-audit.store");
const task_events_rabbitmq_connection_1 = require("./task-events-rabbitmq-connection");
let TaskEventsRabbitMqHandler = class TaskEventsRabbitMqHandler {
    constructor(audit) {
        this.audit = audit;
    }
    async onModuleInit() {
        var _a;
        if (process.env.TASK_EVENTS_STRATEGY !== 'rabbitmq') {
            return;
        }
        const options = createTaskEventsRabbitMqOptions();
        const queue = ((_a = process.env.TASK_RABBITMQ_QUEUE) === null || _a === void 0 ? void 0 : _a.trim()) || 'task-system.audit';
        const autoDelete = process.env.TASK_RABBITMQ_QUEUE_AUTO_DELETE === 'true';
        this.connection = await amqplib_1.default.connect(options.url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(options.exchange, 'topic', {
            durable: true,
        });
        await this.channel.assertQueue(queue, {
            durable: !autoDelete,
            autoDelete,
        });
        await this.channel.bindQueue(queue, options.exchange, tasks_events_client_1.TASK_CREATED_EVENT);
        await this.channel.bindQueue(queue, options.exchange, tasks_events_client_1.TASK_STATUS_CHANGED_EVENT);
        const consumer = await this.channel.consume(queue, (message) => this.handleMessage(message));
        this.consumerTag = consumer.consumerTag;
    }
    async onModuleDestroy() {
        if (this.channel && this.consumerTag) {
            try {
                await this.channel.cancel(this.consumerTag);
            }
            catch (error) {
                if (!(error instanceof Error) || !error.message.includes('closing')) {
                    throw error;
                }
            }
            finally {
                this.consumerTag = undefined;
            }
        }
        await (0, task_events_rabbitmq_connection_1.closeRabbitResource)(this.channel);
        await (0, task_events_rabbitmq_connection_1.closeRabbitResource)(this.connection);
        this.channel = undefined;
        this.connection = undefined;
    }
    handleMessage(message) {
        if (!message || !this.channel) {
            return;
        }
        const payload = JSON.parse(message.content.toString('utf8'));
        this.audit.record({
            eventName: message.fields.routingKey,
            source: 'rabbitmq',
            payload,
        });
        this.channel.ack(message);
    }
};
exports.TaskEventsRabbitMqHandler = TaskEventsRabbitMqHandler;
exports.TaskEventsRabbitMqHandler = TaskEventsRabbitMqHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [task_events_audit_store_1.TaskEventsAuditStore])
], TaskEventsRabbitMqHandler);
function createTaskEventsRabbitMqOptions() {
    var _a, _b;
    const url = (_a = process.env.TASK_RABBITMQ_URL) === null || _a === void 0 ? void 0 : _a.trim();
    if (!url && process.env.TASK_EVENTS_STRATEGY === 'rabbitmq') {
        throw new Error('TASK_RABBITMQ_URL must be set when TASK_EVENTS_STRATEGY is "rabbitmq".');
    }
    return {
        url: url !== null && url !== void 0 ? url : 'amqp://127.0.0.1:5672',
        exchange: ((_b = process.env.TASK_RABBITMQ_EXCHANGE) === null || _b === void 0 ? void 0 : _b.trim()) || 'task-system.events',
    };
}
//# sourceMappingURL=task-events-rabbitmq.handler.js.map