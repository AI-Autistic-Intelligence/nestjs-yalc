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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersApiClient = exports.USERS_CLIENT_HTTP_API_STRATEGY = exports.USERS_CLIENT_LOCAL_API_STRATEGY = exports.USERS_CLIENT_API_STRATEGY = void 0;
const common_1 = require("@nestjs/common");
exports.USERS_CLIENT_API_STRATEGY = 'USERS_CLIENT_API_STRATEGY';
exports.USERS_CLIENT_LOCAL_API_STRATEGY = 'USERS_CLIENT_LOCAL_API_STRATEGY';
exports.USERS_CLIENT_HTTP_API_STRATEGY = 'USERS_CLIENT_HTTP_API_STRATEGY';
let UsersApiClient = class UsersApiClient {
    constructor(api) {
        this.api = api;
    }
    async listUsers() {
        const res = await this.api.get('/users');
        return res.data;
    }
    async createUser(payload) {
        const res = await this.api.post('/users', { data: payload });
        return res.data;
    }
    async listPhones() {
        const res = await this.api.get('/phones');
        return res.data;
    }
    async createPhone(payload) {
        const res = await this.api.post('/phones', { data: payload });
        return res.data;
    }
};
exports.UsersApiClient = UsersApiClient;
exports.UsersApiClient = UsersApiClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(exports.USERS_CLIENT_API_STRATEGY)),
    __metadata("design:paramtypes", [Object])
], UsersApiClient);
//# sourceMappingURL=users-api.client.js.map