"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagaOrchestrator = exports.CqrsEngine = void 0;
class CqrsEngine {
    commandHandlers = new Map();
    queryHandlers = new Map();
    registerCommandHandler(commandType, handler) {
        this.commandHandlers.set(commandType, handler);
    }
    registerQueryHandler(queryType, handler) {
        this.queryHandlers.set(queryType, handler);
    }
    async executeCommand(command) {
        const handler = this.commandHandlers.get(command.type);
        if (!handler) {
            throw new Error(`No CommandHandler registered for command type: ${command.type}`);
        }
        return await handler(command);
    }
    async executeQuery(query) {
        const handler = this.queryHandlers.get(query.type);
        if (!handler) {
            throw new Error(`No QueryHandler registered for query type: ${query.type}`);
        }
        return await handler(query);
    }
}
exports.CqrsEngine = CqrsEngine;
class SagaOrchestrator {
    steps = [];
    addStep(step) {
        this.steps.push(step);
        return this;
    }
    async execute() {
        const executedSteps = [];
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            try {
                await step.action();
                executedSteps.push(step.name);
            }
            catch (err) {
                console.error(`Saga step [${step.name}] failed. Triggering compensation rollback...`, err.message);
                await this.rollback(i - 1);
                return {
                    success: false,
                    executedSteps,
                    error: `Saga step [${step.name}] failed: ${err.message}`,
                };
            }
        }
        return { success: true, executedSteps };
    }
    async rollback(fromIndex) {
        for (let i = fromIndex; i >= 0; i--) {
            const step = this.steps[i];
            try {
                await step.compensation();
            }
            catch (compErr) {
                console.error(`Compensation for step [${step.name}] failed:`, compErr.message);
            }
        }
    }
}
exports.SagaOrchestrator = SagaOrchestrator;
