"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAppEventModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_manager_1 = require("@nestjs-yalc/event-manager");
let TaskAppEventModule = class TaskAppEventModule {
};
exports.TaskAppEventModule = TaskAppEventModule;
exports.TaskAppEventModule = TaskAppEventModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            event_manager_1.EventModule.forRootAsync({
                eventEmitter: {
                    provide: event_emitter_1.EventEmitter2,
                    useValue: new event_emitter_1.EventEmitter2(),
                },
            }),
        ],
        exports: [event_manager_1.EventModule],
    })
], TaskAppEventModule);
//# sourceMappingURL=task-app-event.module.js.map