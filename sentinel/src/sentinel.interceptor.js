"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagGroundednessInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const rag_groundedness_js_1 = require("./algorithms/rag-groundedness.js");
let RagGroundednessInterceptor = class RagGroundednessInterceptor {
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
exports.RagGroundednessInterceptor = RagGroundednessInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Number])
], RagGroundednessInterceptor);
//# sourceMappingURL=sentinel.interceptor.js.map