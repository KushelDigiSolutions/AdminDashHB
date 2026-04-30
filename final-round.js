const fs = require('fs');

let f1 = './src/app/pages/patients/create-patient/create-patient.component.ts';
if (fs.existsSync(f1)) {
    let t1 = fs.readFileSync(f1, 'utf8');
    t1 = t1.replace(/value\s*=\s*\{\s*\.\.\.value/g, 'let body: any = { \n ...value');
    t1 = t1.replace(/this\.api\.createPatient\(value\)/g, 'this.api.createPatient(body)');
    fs.writeFileSync(f1, t1, 'utf8');
}

let f2 = './src/app/pages/patients/patient-detail/components/add-health-stats/add-health-stats.component.ts';
if (fs.existsSync(f2)) {
    let t2 = fs.readFileSync(f2, 'utf8');
    t2 = t2.replace(/if\s*\(invalid\)\s*return\s*this\.toastr\.error\([^)]*\);/g, "if (invalid) { this.toastr.error('Please enter a valid detail.'); return; }");
    fs.writeFileSync(f2, t2, 'utf8');
}

let f3 = './src/app/pages/patients/patients.module.ts';
if (fs.existsSync(f3)) {
    let t3 = fs.readFileSync(f3, 'utf8');
    if (!t3.includes('NgxIntlTelInputModule')) {
        t3 = "import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';\nimport { SwiperModule } from 'swiper/angular';\nimport { NgxChartistModule } from 'ngx-chartist';\nimport { NgChartsModule } from 'ng2-charts';\n" + t3;
        t3 = t3.replace(/UIModule,/g, 'UIModule, NgxIntlTelInputModule, SwiperModule, NgxChartistModule, NgChartsModule,');
    }
    fs.writeFileSync(f3, t3, 'utf8');
}

let f4 = './src/app/components/view-appointment/view-appointment.module.ts';
if (fs.existsSync(f4)) {
    let t4 = fs.readFileSync(f4, 'utf8');
    // If it relies on ngx-mask still throwing issues, maybe `provideNgxMask` is needed inside providers array!
    if (!t4.includes('provideNgxMask')) {
        t4 = t4.replace(/NgxMaskDirective,/g, 'NgxMaskDirective,');
        t4 = t4.replace(/import\s+{\s*NgxMaskDirective\s*}\s*from\s*['"]ngx-mask['"];/g, "import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';");
        t4 = t4.replace(/exports:\s*\[/g, 'providers: [provideNgxMask()], \n exports: [');
    }
    fs.writeFileSync(f4, t4, 'utf8');
}
