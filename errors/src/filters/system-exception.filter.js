"use strict";
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
exports.SystemExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const error_enum_js_1 = require("../error.enum.js");
let SystemExceptionFilter = class SystemExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(error) {
        this.logger.error(error, error.stack, error_enum_js_1.ExceptionContextEnum.SYSTEM);
        return error;
    }
};
exports.SystemExceptionFilter = SystemExceptionFilter;
exports.SystemExceptionFilter = SystemExceptionFilter = __decorate([
    (0, common_1.Catch)(TypeError, SyntaxError, RangeError, EvalError, ReferenceError),
    __metadata("design:paramtypes", [Object])
], SystemExceptionFilter);
//# sourceMappingURL=system-exception.filter.js.map