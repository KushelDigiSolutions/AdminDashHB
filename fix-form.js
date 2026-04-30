const fs = require('fs');

let f1 = './src/app/pages/role/consultant/profile/profile.component.ts';
let t1 = fs.readFileSync(f1, 'utf8');
t1 = t1.replace('form = this.fb.group({', 'form: any = this.fb.group({');
fs.writeFileSync(f1, t1, 'utf8');

let f2 = './src/app/pages/role/consultant/schedule-timings/schedule-timings.component.ts';
let t2 = fs.readFileSync(f2, 'utf8');
t2 = t2.replace("form = this.fb.group({", "form: any = this.fb.group({");
fs.writeFileSync(f2, t2, 'utf8');
