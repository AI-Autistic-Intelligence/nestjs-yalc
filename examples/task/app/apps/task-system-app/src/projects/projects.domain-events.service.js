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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsDomainEventsService = void 0;
const common_1 = require("@nestjs/common");
const event_manager_1 = require("@nestjs-yalc/event-manager");
const logger_factory_1 = require("@nestjs-yalc/logger/logger.factory");
let ProjectsDomainEventsService = class ProjectsDomainEventsService {
    constructor(events) {
        this.events = events;
        this.logger = (0, logger_factory_1.AppLoggerFactory)('TaskSystem.Projects');
    }
    async emitProjectCreated(projectId, name) {
        await this.events.log(['task-system', 'projects', 'created'], {
            message: 'Project created',
            data: {
                projectId,
                name,
            },
            event: { await: true },
            eventAliases: ['projects.created'],
            logger: {
                instance: this.logger,
            },
        });
    }
};
exports.ProjectsDomainEventsService = ProjectsDomainEventsService;
exports.ProjectsDomainEventsService = ProjectsDomainEventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_manager_1.YalcEventService])
], ProjectsDomainEventsService);
//# sourceMappingURL=projects.domain-events.service.js.map