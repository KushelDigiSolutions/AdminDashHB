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
            if (txt.includes('ng5-slider')) {
                txt = txt.replace(/import\s+\{([^}]+)\}\s+from\s+['"]ng5-slider['"];/g, '// import {$1} from "ng5-slider";');
                m = true;
            }
            if (txt.includes('Ng5SliderModule')) {
                txt = txt.replace(/Ng5SliderModule,/g, '// Ng5SliderModule,');
                txt = txt.replace(/Ng5SliderModule/g, '// Ng5SliderModule');
                m = true;
            }
            if (m) fs.writeFileSync(fullPath, txt);
        }
    }
}
walk('./src/app');
