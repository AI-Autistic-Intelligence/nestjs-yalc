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
exports.MutationJournalQueryService = void 0;
exports.parseMutationJournalRow = parseMutationJournalRow;
const common_1 = require("@nestjs/common");
const mutation_journal_service_js_1 = require("./mutation-journal.service.js");
function parseMutationJournalRow(row) {
    return Object.assign(Object.assign({}, row), { old: row.oldRow === null ? null : JSON.parse(row.oldRow), new: row.newRow === null ? null : JSON.parse(row.newRow) });
}
let MutationJournalQueryService = class MutationJournalQueryService {
    constructor(mutationJournalService) {
        this.mutationJournalService = mutationJournalService;
    }
    async find(target, filter) {
        const resolvedTarget = await this.mutationJournalService.resolveTarget(target);
        if (!resolvedTarget) {
            return [];
        }
        return resolvedTarget.driver.read(resolvedTarget.dataSource, this.mutationJournalService.getDriverOptions(), filter);
    }
};
exports.MutationJournalQueryService = MutationJournalQueryService;
exports.MutationJournalQueryService = MutationJournalQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(mutation_journal_service_js_1.MutationJournalService)),
    __metadata("design:paramtypes", [Object])
], MutationJournalQueryService);
//# sourceMappingURL=mutation-journal-query.service.js.map