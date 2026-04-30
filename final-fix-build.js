const fs = require('fs');

let f1 = './src/app/pages/notifications/push-notifications/push-notifications.component.ts';
if (fs.existsSync(f1)) {
    let t1 = fs.readFileSync(f1, 'utf8');
    t1 = t1.replace(/return\s+this\.createPersonlizedTemplate/g, 'this.createPersonlizedTemplate');
    t1 = t1.replace(/return\s+this\.router\.navigateByUrl/g, 'this.router.navigateByUrl');
    fs.writeFileSync(f1, t1, 'utf8');
}

let f2 = './src/app/pages/maps/maps.module.ts';
if (fs.existsSync(f2)) {
    let t2 = fs.readFileSync(f2, 'utf8');
    if (!t2.includes('NO_ERRORS_SCHEMA')) {
        t2 = t2.replace(/import\s+\{\s*NgModule,\s*CUSTOM_ELEMENTS_SCHEMA\s*\}\s*from\s*['"]@angular\/core['"];/g, 
                        "import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';");
        t2 = t2.replace(/schemas:\s*\[CUSTOM_ELEMENTS_SCHEMA\],/g, 'schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],');
    }
    fs.writeFileSync(f2, t2, 'utf8');
}
