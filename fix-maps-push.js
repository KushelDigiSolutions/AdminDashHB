const fs = require('fs');

let f1 = './src/app/pages/notifications/push-notifications/push-notifications.component.ts';
if (fs.existsSync(f1)) {
    let t1 = fs.readFileSync(f1, 'utf8');
    t1 = t1.replace(/let\s+\{\s*type\s*\}\s*=\s*this\.form\.value;/g, 'let { type } = this.form.value as any;');
    t1 = t1.replace(/let\s+value\s*=\s*\{\s*\.\.\.this\.form\.value\s*\};/g, 'let value: any = { ...this.form.value };');
    fs.writeFileSync(f1, t1, 'utf8');
} 

let f2 = './src/app/pages/maps/maps.module.ts';
if (fs.existsSync(f2)) {
    let t2 = fs.readFileSync(f2, 'utf8');
    if (!t2.includes('CUSTOM_ELEMENTS_SCHEMA')) {
        t2 = t2.replace(/import\s+\{\s*NgModule\s*\}\s*from\s*['"]@angular\/core['"];/g, 
                        "import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';");
        t2 = t2.replace(/imports:\s*\[/g, 'schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  imports: [');
    }
    fs.writeFileSync(f2, t2, 'utf8');
}
