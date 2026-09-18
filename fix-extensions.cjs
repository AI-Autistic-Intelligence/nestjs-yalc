const fs = require('fs');
const path = require('path');

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

    // Remove .js from @node-yalc/... imports
    const newContent = content.replace(/from\s+['"](@node-yalc\/.*?)\.js['"]/g, "from '$1'");
    if (newContent !== content) {
        content = newContent;
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
