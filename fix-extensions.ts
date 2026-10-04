/**
 * @file fix-extensions.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import fs  from 'fs';
import path  from 'path';

const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('node-yalc')) {
                results = results.concat(walk(file));
            }
        } else { 
            /* Is a file */
            if (file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('C:\\Users\\nn\\Desktop\\code\\nestjs-yalc');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Add .js to @node-yalc/... imports
    const newContent = content.replace(/from\s+['"](@node-yalc\/[^']+)['"]/g, (match, p1) => {
        if (p1.endsWith('.js')) return match;
        return `from '${p1}.js'`;
    });
    if (newContent !== content) {
        content = newContent;
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
