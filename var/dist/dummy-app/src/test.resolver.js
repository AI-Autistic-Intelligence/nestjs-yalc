import { __decorate, __metadata } from "tslib";
import { Resolver, Query } from '@nestjs/graphql';
import { TestEntity } from './test.entity';
let TestResolver = class TestResolver {
    helloWorld() {
        return 'Hello from YALC E2E!';
    }
    getTests() {
        return [{ id: 'uuid-1', name: 'Test 1' }];
    }
};
__decorate([
    Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], TestResolver.prototype, "helloWorld", null);
__decorate([
    Query(() => [TestEntity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], TestResolver.prototype, "getTests", null);
TestResolver = __decorate([
    Resolver(() => TestEntity)
], TestResolver);
export { TestResolver };
//# sourceMappingURL=test.resolver.js.map