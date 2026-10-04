"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResolver = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const test_entity_1 = require("./test.entity");
let TestResolver = class TestResolver {
    helloWorld() {
        return 'Hello from YALC E2E!';
    }
    getTests() {
        return [{ id: 'uuid-1', name: 'Test 1' }];
    }
};
exports.TestResolver = TestResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => String),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", String)
], TestResolver.prototype, "helloWorld", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [test_entity_1.TestEntity]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], TestResolver.prototype, "getTests", null);
exports.TestResolver = TestResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => test_entity_1.TestEntity)
], TestResolver);
//# sourceMappingURL=test.resolver.js.map