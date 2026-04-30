const fs = require('fs');
const path = require('path');

const problematic = [
    'NgWizardModule',
    'ArchwizardModule',
    'UiSwitchModule',
    'ColorPickerModule',
    'Ng2SearchPipeModule',
    'Ng2FlatpickrModule',
    'AgmCoreModule'
];

function cleanse(filePath) {
    if (!fs.existsSync(filePath)) return;
    let txt = fs.readFileSync(filePath, 'utf8');
    let m = false;

    problematic.forEach(mod => {
        if (txt.includes(mod)) {
            // Comment out from imports array
            let re = new RegExp(`\\b${mod}\\b`, 'g');
            txt = txt.replace(re, `/* ${mod} */`);
            m = true;
        }
    });

    // Fix specific NgWizardModule.forRoot
    if (txt.includes('NgWizardModule.forRoot')) {
        txt = txt.replace(/NgWizardModule\.forRoot\([^)]*\)/g, '/* NgWizardModule.forRoot(...) */');
        m = true;
    }

    if (m) fs.writeFileSync(filePath, txt, 'utf8');
}

cleanse('./src/app/pages/form/form.module.ts');
cleanse('./src/app/pages/invoices/invoices.module.ts');
cleanse('./src/app/pages/lifestyle/lifestyle.module.ts');
cleanse('./src/app/pages/maps/maps.module.ts');

// Fix Ecommerce products error
let p1 = './src/app/pages/ecommerce/products/products.component.ts';
if (fs.existsSync(p1)) {
    let t1 = fs.readFileSync(p1, 'utf8');
    t1 = t1.replace(/quantityRange\s*:\s*["']max["']\s*\|\s*["']min["']/g, 'quantityRange: any');
    fs.writeFileSync(p1, t1, 'utf8');
}
