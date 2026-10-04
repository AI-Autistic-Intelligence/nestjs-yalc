import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@nestjs/common';
import { MutationJournalService, } from './mutation-journal.service.js';
export function parseMutationJournalRow(row) {
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
MutationJournalQueryService = __decorate([
    Injectable(),
    __param(0, Inject(MutationJournalService)),
    __metadata("design:paramtypes", [Object])
], MutationJournalQueryService);
export { MutationJournalQueryService };
//# sourceMappingURL=mutation-journal-query.service.js.map