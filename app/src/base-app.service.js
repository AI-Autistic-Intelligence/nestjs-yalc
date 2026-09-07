"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAppService = void 0;
const common = __importStar(require("@nestjs/common"));
const event_emitter_1 = require("@nestjs/event-emitter");
const def_const_js_1 = require("@nest-yalc-2/app/def.const.js");
const app_events_js_1 = require("./app.events.js");
let BaseAppService = class BaseAppService {
    constructor(logger) {
        this.logger = logger;
    }
    getHello(appName) {
        return `Hello World from ${appName}!`;
    }
    handleBeforeAllRoutes(context) {
        const handlerName = context.getHandler().name;
        if (!handlerName.startsWith('_') && handlerName.includes('_'))
            this.logger.debug?.(`Running Handler: ${handlerName}`);
    }
};
exports.BaseAppService = BaseAppService;
__decorate([
    (0, event_emitter_1.OnEvent)(app_events_js_1.AppEvents.BEFORE_ALL_ROUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseAppService.prototype, "handleBeforeAllRoutes", null);
exports.BaseAppService = BaseAppService = __decorate([
    common.Injectable(),
    __param(0, common.Inject(def_const_js_1.APP_LOGGER_SERVICE)),
    __metadata("design:paramtypes", [Object])
], BaseAppService);
//# sourceMappingURL=base-app.service.js.map