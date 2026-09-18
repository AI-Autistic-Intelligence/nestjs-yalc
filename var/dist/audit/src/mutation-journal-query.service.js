"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationJournalQueryService = void 0;
exports.parseMutationJournalRow = parseMutationJournalRow;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mutation_journal_service_js_1 = require("./mutation-journal.service.js");
function parseMutationJournalRow(row) {
    return {
        ...row,
        old: row.oldRow === null ? null : JSON.parse(row.oldRow),
        new: row.newRow === null ? null : JSON.parse(row.newRow),
    };
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
exports.MutationJournalQueryService = MutationJournalQueryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(mutation_journal_service_js_1.MutationJournalService)),
    tslib_1.__metadata("design:paramtypes", [Object])
], MutationJournalQueryService);
//# sourceMappingURL=mutation-journal-query.service.js.map