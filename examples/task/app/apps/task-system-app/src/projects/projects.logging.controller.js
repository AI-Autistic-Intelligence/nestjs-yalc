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
exports.ProjectsLoggingController = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const projects_domain_events_service_1 = require("./projects.domain-events.service");
let ProjectsLoggingController = class ProjectsLoggingController {
    constructor(service) {
        this.service = service;
    }
    async logProjectEvent() {
        const projectId = (0, node_crypto_1.randomUUID)();
        await this.service.emitProjectCreated(projectId, 'Project event demo');
        return {
            ok: true,
            projectId,
        };
    }
};
exports.ProjectsLoggingController = ProjectsLoggingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectsLoggingController.prototype, "logProjectEvent", null);
exports.ProjectsLoggingController = ProjectsLoggingController = __decorate([
    (0, common_1.Controller)('projects-logging'),
    __metadata("design:paramtypes", [projects_domain_events_service_1.ProjectsDomainEventsService])
], ProjectsLoggingController);
//# sourceMappingURL=projects.logging.controller.js.map