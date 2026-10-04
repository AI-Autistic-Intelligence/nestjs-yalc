/**
 * @file fix-tests.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import fs  from 'fs';
import glob  from 'glob';

const files = glob.sync('**/*.ts', { ignore: ['node_modules/**', 'dist/**'] });
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('@nest-yalc-2/')) {
        let changed = false;
        
        // Utils
        content = content.replace(/@nest-yalc-2\/utils\/(env\.helper|returnValue|date\.helper|enum\.helper|plugin\.helper|http\.helper|object-mapper\.helper|class\.helper)(.*?)/g, (match, p1, p2) => {
            changed = true;
            let ext = (p2.endsWith('.js') || p2.endsWith('.ts')) ? p2 : p2 + '.js';
            return '@node-yalc/utils/' + p1 + ext;
        });
        
        // Errors
        content = content.replace(/@nest-yalc-2\/errors\/(default\.error|error\.helper|error\.class|http-status-code-to-errors|error\.enum|result\.error)(.*?)/g, (match, p1, p2) => {
            changed = true;
            let ext = (p2.endsWith('.js') || p2.endsWith('.ts')) ? p2 : p2 + '.js';
            return '@node-yalc/errors/' + p1 + ext;
        });
        
        // Logger
        content = content.replace(/@nest-yalc-2\/logger\/(logger-abstract\.service|logger\.helper|logger\.event|logger\.factory)(.*?)/g, (match, p1, p2) => {
            changed = true;
            let ext = (p2.endsWith('.js') || p2.endsWith('.ts')) ? p2 : p2 + '.js';
            return '@nest-yalc-2/logger/' + p1 + ext;
        });
        
        // Event Manager
        content = content.replace(/@nest-yalc-2\/event-manager\/(event-result\.types|event\.helper|event\.class|event|global-emitter|emitter)(.*?)/g, (match, p1, p2) => {
            changed = true;
            let ext = (p2.endsWith('.js') || p2.endsWith('.ts')) ? p2 : p2 + '.js';
            return '@nest-yalc-2/event-manager/' + p1 + ext;
        });

        // Interfaces
        content = content.replace(/@nest-yalc-2\/interfaces\/(.*?)(['\"\`])/g, (match, p1, p2) => {
            changed = true;
            let ext = (p1.endsWith('.js') || p1.endsWith('.ts')) ? p1 : p1 + '.js';
            return '@nest-yalc-2/interfaces/' + ext + p2;
        });

        if (changed) {
            fs.writeFileSync(file, content);
            console.log('Fixed in ' + file);
        }
    }
}
