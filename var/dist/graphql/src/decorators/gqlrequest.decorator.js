"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlGetRequest = exports.paramDecoratorToCreate = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const paramDecoratorToCreate = (_data, context) => {
    const ctx = graphql_1.GqlExecutionContext.create(context);
    return ctx.getContext().req;
};
exports.paramDecoratorToCreate = paramDecoratorToCreate;
exports.GqlGetRequest = (0, common_1.createParamDecorator)(exports.paramDecoratorToCreate);
//# sourceMappingURL=gqlrequest.decorator.js.map