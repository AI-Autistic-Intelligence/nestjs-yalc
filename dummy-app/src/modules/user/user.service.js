"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_service_service_1 = require("@nest-yalc-2/ag-grid/generic-service.service");
const user_entity_1 = require("../../entities/user.entity");
const ag_grid_repository_1 = require("@nest-yalc-2/ag-grid/ag-grid.repository");
let UserService = class UserService extends generic_service_service_1.GenericService {
    constructor(userRepository) {
        super(new ag_grid_repository_1.AgGridRepository(userRepository.target, userRepository.manager, userRepository.queryRunner));
        this.userRepository = userRepository;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map