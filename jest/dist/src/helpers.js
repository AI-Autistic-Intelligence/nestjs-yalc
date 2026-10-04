"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestFilenameWithoutExtension = getTestFilenameWithoutExtension;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
function getTestFilenameWithoutExtension(testPath, testExtension) {
    return path
        .basename(testPath)
        .replace('.spec.ts', '')
        .replace('.e2e-spec.ts', '')
        .replace(testExtension ?? '', '');
}
//# sourceMappingURL=helpers.js.map