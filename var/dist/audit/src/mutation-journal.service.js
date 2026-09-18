"use strict";
var MutationJournalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationJournalService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const mutation_journal_def_js_1 = require("./mutation-journal.def.js");
let MutationJournalService = MutationJournalService_1 = class MutationJournalService {
    constructor(moduleRef, options, drivers) {
        this.moduleRef = moduleRef;
        this.options = options;
        this.drivers = drivers;
        this.logger = new common_1.Logger(MutationJournalService_1.name);
        this.reports = [];
    }
    async onApplicationBootstrap() {
        if (!this.options.enabled) {
            if (this.options.uninstallWhenDisabled) {
                await this.uninstall();
            }
            return;
        }
        if (this.options.installOnBootstrap !== false) {
            await this.install();
        }
    }
    async install() {
        const reports = await Promise.all(this.options.targets.map((target) => this.installTarget(target)));
        this.reports = reports;
        return reports;
    }
    async refresh() {
        return this.install();
    }
    async uninstall() {
        await Promise.all(this.options.targets.map(async (target) => {
            const resolvedTarget = await this.resolveTarget(target);
            if (!resolvedTarget) {
                return;
            }
            try {
                await resolvedTarget.driver.uninstall(resolvedTarget.dataSource, this.getDriverOptions());
            }
            catch (error) {
                this.logger.warn(`Unable to uninstall mutation journal for ${this.getTargetName(target)}: ${this.getErrorMessage(error)}`);
            }
        }));
    }
    getReports() {
        return [...this.reports];
    }
    getTargets() {
        return this.options.targets;
    }
    getDriverOptions() {
        return {
            journalTableName: this.options.journalTableName,
            excludedTables: this.options.excludedTables,
            actorSetting: this.options.actorSetting,
        };
    }
    async resolveTarget(target = {}) {
        const token = target.token ?? (0, typeorm_1.getDataSourceToken)(target.dataSourceName);
        let dataSource;
        try {
            dataSource = this.moduleRef.get(token, { strict: false });
            if (!dataSource) {
                this.logger.warn(`Unable to resolve mutation journal target ${this.getTargetName(target)}.`);
                return undefined;
            }
            const resolvedDataSource = dataSource;
            const driver = this.drivers.find((candidate) => candidate.supports(resolvedDataSource));
            if (!driver) {
                this.logger.warn(`No mutation journal driver supports ${this.getTargetName(target)}.`);
                return undefined;
            }
            return { dataSource: resolvedDataSource, driver, target };
        }
        catch (error) {
            this.logger.warn(`Unable to resolve mutation journal target ${this.getTargetName(target)}: ${this.getErrorMessage(error)}`);
            return undefined;
        }
    }
    async installTarget(target) {
        const resolvedTarget = await this.resolveTarget(target);
        if (!resolvedTarget) {
            return {
                dataSourceName: this.getTargetName(target),
                engine: 'unknown',
                journaledTables: [],
                skippedTables: [],
            };
        }
        try {
            const report = await resolvedTarget.driver.install(resolvedTarget.dataSource, this.getDriverOptions());
            this.logger.log(`Installed mutation journal for ${this.getTargetName(target)} (${report.journaledTables.length} tables).`);
            return report;
        }
        catch (error) {
            this.logger.warn(`Unable to install mutation journal for ${this.getTargetName(target)}: ${this.getErrorMessage(error)}`);
            return {
                dataSourceName: this.getTargetName(target),
                engine: resolvedTarget.driver.engine,
                journaledTables: [],
                skippedTables: [],
            };
        }
    }
    getTargetName(target) {
        return target.dataSourceName ?? 'default';
    }
    getErrorMessage(error) {
        return error instanceof Error ? error.message : String(error);
    }
};
exports.MutationJournalService = MutationJournalService;
exports.MutationJournalService = MutationJournalService = MutationJournalService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(core_1.ModuleRef)),
    tslib_1.__param(1, (0, common_1.Inject)(mutation_journal_def_js_1.MUTATION_JOURNAL_OPTIONS)),
    tslib_1.__param(2, (0, common_1.Inject)(mutation_journal_def_js_1.MUTATION_JOURNAL_DRIVERS)),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Array])
], MutationJournalService);
//# sourceMappingURL=mutation-journal.service.js.map