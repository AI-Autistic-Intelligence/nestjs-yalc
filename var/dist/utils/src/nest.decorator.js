import { createParamDecorator } from '@nestjs/common';
export const paramDecoratorToCreate = (_data, context) => {
    return context;
};
export const GetContext = createParamDecorator(paramDecoratorToCreate);
//# sourceMappingURL=nest.decorator.js.map