"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetContext = exports.paramDecoratorToCreate = void 0;
const common_1 = require("@nestjs/common");
const paramDecoratorToCreate = (_data, context) => {
    return context;
};
exports.paramDecoratorToCreate = paramDecoratorToCreate;
exports.GetContext = (0, common_1.createParamDecorator)(exports.paramDecoratorToCreate);
//# sourceMappingURL=nest.decorator.js.map