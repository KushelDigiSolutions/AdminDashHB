const fs = require('fs');
const path = require('path');
function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.scss')) {
            let txt = fs.readFileSync(fullPath, 'utf8');
            if (txt.includes('~')) {
                txt = txt.replace(/@import '~([^']+)'/g, "@import '$1'").replace(/@import "~([^"]+)"/g, '@import "$1"');
                fs.writeFileSync(fullPath, txt);
            }
        }
    }
}
walk('./src/assets/scss');
