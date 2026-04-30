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
            
            if (txt.includes('NgxMaskModule')) {
                // Change imports
                txt = txt.replace(/import\s+\{([^}]*?)NgxMaskModule([^}]*?)\}\s+from\s+['"]ngx-mask['"];/g, 
                                  "import { $1NgxMaskDirective, provideNgxMask$2 } from 'ngx-mask';");
                
                // Change usage
                txt = txt.replace(/NgxMaskModule\.forRoot\([^)]*\)/g, 'NgxMaskDirective');
                txt = txt.replace(/NgxMaskModule\.forChild\([^)]*\)/g, 'NgxMaskDirective');
                txt = txt.replace(/NgxMaskModule/g, 'NgxMaskDirective');
                
                m = true;
            }

            // Fix FormBuilders
            if (txt.includes('form = this.fb.group({') && fullPath.includes('schedule-timings')) {
                 txt = txt.replace(/form = this\.fb\.group\(\{/g, 'form: any = this.fb.group({');
                 m = true;
            }
            if (txt.includes('form = this.fb.group({') && fullPath.includes('profile.component')) {
                 txt = txt.replace(/form = this\.fb\.group\(\{/g, 'form: any = this.fb.group({');
                 m = true;
            }

            if (m) fs.writeFileSync(fullPath, txt, 'utf8');
        }
    }
}
walk('./src/app');
