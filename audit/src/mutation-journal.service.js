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
var MutationJournalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationJournalService = void 0;
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
exports.MutationJournalService = MutationJournalService = MutationJournalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.ModuleRef)),
    __param(1, (0, common_1.Inject)(mutation_journal_def_js_1.MUTATION_JOURNAL_OPTIONS)),
    __param(2, (0, common_1.Inject)(mutation_journal_def_js_1.MUTATION_JOURNAL_DRIVERS)),
    __metadata("design:paramtypes", [Object, Object, Array])
], MutationJournalService);
//# sourceMappingURL=mutation-journal.service.js.map