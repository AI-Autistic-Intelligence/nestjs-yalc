"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseExceptionFilter = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const common = tslib_1.__importStar(require("@nestjs/common"));
const typeorm_1 = require("typeorm");
const error_enum_1 = require("@node-yalc/errors/error.enum");
let DatabaseExceptionFilter = class DatabaseExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(error, host) {
        const gqlHost = graphql_1.GqlArgumentsHost.create(host);
        gqlHost.getType();
        switch (true) {
            case error instanceof typeorm_1.EntityNotFoundError:
                this.logger.error(error, error_enum_1.ExceptionContextEnum.DATABASE);
                error = new common.InternalServerErrorException(error);
                break;
            default:
                this.logger.error(error, error.stack, error_enum_1.ExceptionContextEnum.DATABASE);
                break;
        }
        return error;
    }
};
exports.DatabaseExceptionFilter = DatabaseExceptionFilter;
exports.DatabaseExceptionFilter = DatabaseExceptionFilter = tslib_1.__decorate([
    common.Catch(typeorm_1.EntityNotFoundError, typeorm_1.ConnectionNotFoundError),
    tslib_1.__metadata("design:paramtypes", [Object])
], DatabaseExceptionFilter);
//# sourceMappingURL=database-exception.filter.js.map