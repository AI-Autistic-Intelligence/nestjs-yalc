"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEventsAuditStore = void 0;
const common_1 = require("@nestjs/common");
let TaskEventsAuditStore = class TaskEventsAuditStore {
    constructor() {
        this.events = [];
        this.waiters = new Set();
    }
    record(event) {
        this.events.push(event);
        for (const waiter of [...this.waiters]) {
            if (waiter.predicate(event)) {
                clearTimeout(waiter.timeout);
                this.waiters.delete(waiter);
                waiter.resolve(event);
            }
        }
    }
    list() {
        return [...this.events];
    }
    clear() {
        this.events.length = 0;
    }
    waitFor(predicate, timeoutMs = 5000) {
        const existing = this.events.find(predicate);
        if (existing) {
            return Promise.resolve(existing);
        }
        return new Promise((resolve, reject) => {
            const waiter = {
                predicate,
                resolve,
                reject,
                timeout: setTimeout(() => {
                    this.waiters.delete(waiter);
                    reject(new Error('Timed out waiting for task domain event.'));
                }, timeoutMs),
            };
            this.waiters.add(waiter);
        });
    }
};
exports.TaskEventsAuditStore = TaskEventsAuditStore;
exports.TaskEventsAuditStore = TaskEventsAuditStore = __decorate([
    (0, common_1.Injectable)()
], TaskEventsAuditStore);
//# sourceMappingURL=task-events-audit.store.js.map