const fs = require('fs');

let f1 = './src/app/pages/patients/create-patient/create-patient.component.ts';
if (fs.existsSync(f1)) {
    let t1 = fs.readFileSync(f1, 'utf8');
    t1 = t1.replace(/phone\.e164Number/g, '(phone as any).e164Number');
    t1 = t1.replace(/phone\.dialCode/g, '(phone as any).dialCode');
    t1 = t1.replace(/phone\.countryCode/g, '(phone as any).countryCode');
    t1 = t1.replace(/phone\.number/g, '(phone as any).number');
    fs.writeFileSync(f1, t1, 'utf8');
}

let f2 = './src/app/pages/patients/patient-detail/components/add-health-stats/add-health-stats.component.ts';
if (fs.existsSync(f2)) {
    let t2 = fs.readFileSync(f2, 'utf8');
    t2 = t2.replace(/onSubmit\(\)\s*\{/g, 'onSubmit(): void {');
    fs.writeFileSync(f2, t2, 'utf8');
}

let f3 = './src/app/components/view-appointment/view-appointment.module.ts';
if (fs.existsSync(f3)) {
    let t3 = fs.readFileSync(f3, 'utf8');
    t3 = t3.replace(/import\s+{\s*NgxMaskDirective,\s*provideNgxMask\s*}\s*from\s*['"]ngx-mask['"];/g, "import { NgxMaskDirective } from 'ngx-mask';");
    fs.writeFileSync(f3, t3, 'utf8');
}
