"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_READ_LIMIT = exports.BUILTIN_EXCLUDED_TABLES = exports.DEFAULT_JOURNAL_TABLE = exports.MUTATION_JOURNAL_DRIVERS = exports.MUTATION_JOURNAL_OPTIONS = void 0;
exports.MUTATION_JOURNAL_OPTIONS = Symbol('nestjs-yalc:mutation-journal:options');
exports.MUTATION_JOURNAL_DRIVERS = Symbol('nestjs-yalc:mutation-journal:drivers');
exports.DEFAULT_JOURNAL_TABLE = '_mutation_journal';
exports.BUILTIN_EXCLUDED_TABLES = ['migrations', 'typeorm_metadata'];
exports.DEFAULT_READ_LIMIT = 100;
//# sourceMappingURL=mutation-journal.def.js.map