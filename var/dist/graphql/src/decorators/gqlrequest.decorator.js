import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
export const paramDecoratorToCreate = (_data, context) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
};
export const GqlGetRequest = createParamDecorator(paramDecoratorToCreate);
//# sourceMappingURL=gqlrequest.decorator.js.map