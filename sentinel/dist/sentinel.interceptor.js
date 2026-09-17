"use strict";
/**
 * # NestJS Ferrox-Node RAG Groundedness & Response Interceptor (`sentinel.interceptor.ts`)
 * Evaluates LLM generated response groundedness against retrieved context
 */
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
exports.RagGroundednessInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const rag_groundedness_js_1 = require("./algorithms/rag-groundedness.js");
let RagGroundednessInterceptor = class RagGroundednessInterceptor {
    minGroundednessScore;
    constructor(minGroundednessScore = 0.70) {
        this.minGroundednessScore = minGroundednessScore;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const retrievedContexts = request.ragContexts || [];
        return next.handle().pipe((0, operators_1.map)((response) => {
            if (typeof response === 'string' && retrievedContexts.length > 0) {
                const assessment = rag_groundedness_js_1.RagHallucinationGroundednessEngine.evaluateGroundedness(response, retrievedContexts, this.minGroundednessScore);
                if (!assessment.isGrounded) {
                    throw new common_1.BadGatewayException(`[FerroxSentinel] LLM response failed groundedness check (Score: ${assessment.groundednessScore.toFixed(2)} < ${this.minGroundednessScore})`);
                }
            }
            return response;
        }));
    }
};
exports.RagGroundednessInterceptor = RagGroundednessInterceptor;
exports.RagGroundednessInterceptor = RagGroundednessInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number])
], RagGroundednessInterceptor);
