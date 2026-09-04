import * as path from 'path';
export function getTestFilenameWithoutExtension(testPath, testExtension) {
    return path
        .basename(testPath)
        .replace('.spec.ts', '')
        .replace('.e2e-spec.ts', '')
        .replace(testExtension ?? '', '');
}
//# sourceMappingURL=helpers.js.map