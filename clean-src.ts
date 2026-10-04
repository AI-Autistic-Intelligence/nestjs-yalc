/**
 * @file clean-src.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import glob  from 'glob';
import fs  from 'fs';
const files = glob.sync('**/*.{js,js.map,d.ts}', { ignore: ['node_modules/**', 'dist/**', 'var/**'] });
let count = 0;
for (const file of files) {
    if (file.includes('/src/') || file.includes('\\src\\') || file.startsWith('src/')) {
        fs.unlinkSync(file);
        count++;
    }
}
console.log('Deleted ' + count + ' files from src directories.');
