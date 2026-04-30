const fs = require('fs');

let f3 = './src/app/pages/patients/patients.module.ts';
if (fs.existsSync(f3)) {
    let t3 = fs.readFileSync(f3, 'utf8');
    if (!t3.includes('NgbPaginationModule')) {
        t3 = "import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';\n" + t3;
        t3 = t3.replace(/UIModule,/g, 'UIModule, NgbPaginationModule,');
    }
    fs.writeFileSync(f3, t3, 'utf8');
}
