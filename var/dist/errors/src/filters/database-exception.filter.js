import { __decorate, __metadata } from "tslib";
import { GqlArgumentsHost } from '@nestjs/graphql';
import * as common from '@nestjs/common';
import { EntityNotFoundError, ConnectionNotFoundError } from 'typeorm';
import { ExceptionContextEnum } from '../error.enum.js';
let DatabaseExceptionFilter = class DatabaseExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(error, host) {
        const gqlHost = GqlArgumentsHost.create(host);
        gqlHost.getType();
        switch (true) {
            case error instanceof EntityNotFoundError:
                this.logger.error(error, ExceptionContextEnum.DATABASE);
                error = new common.InternalServerErrorException(error);
                break;
            default:
                this.logger.error(error, error.stack, ExceptionContextEnum.DATABASE);
                break;
        }
        return error;
    }
};
DatabaseExceptionFilter = __decorate([
    common.Catch(EntityNotFoundError, ConnectionNotFoundError),
    __metadata("design:paramtypes", [Object])
], DatabaseExceptionFilter);
export { DatabaseExceptionFilter };
//# sourceMappingURL=database-exception.filter.js.map