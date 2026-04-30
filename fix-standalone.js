const fs = require('fs');
const path = require('path');
function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.ts')) {
            let txt = fs.readFileSync(fullPath, 'utf8');
            let m = false;
            if (txt.includes('@Component({') && !txt.includes('standalone:')) {
                txt = txt.replace(/@Component\(\s*\{/g, '@Component({\n  standalone: false,');
                m = true;
            }
            if (txt.includes('@Directive({') && !txt.includes('standalone:')) {
                txt = txt.replace(/@Directive\(\s*\{/g, '@Directive({\n  standalone: false,');
                m = true;
            }
            if (txt.includes('@Pipe({') && !txt.includes('standalone:')) {
                txt = txt.replace(/@Pipe\(\s*\{/g, '@Pipe({\n  standalone: false,');
                m = true;
            }
            if (m) fs.writeFileSync(fullPath, txt);
        }
    }
}
walk('./src/app');
