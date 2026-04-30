const fs=require('fs'); 
const files=['src/app/layouts/layouts.module.ts', 'src/app/pages/cms/health-packages/health-packages.module.ts', 'src/app/pages/cms/life-style-categories/life-style-categories.module.ts', 'src/app/pages/assessments/assessments.module.ts', 'src/app/components/subscribed-health-packages/subscribed-health-packages.module.ts']; 
files.forEach(f => {
  if(fs.existsSync(f)) {
    let s = fs.readFileSync(f, 'utf8');
    s = s.replace(/from\s*['"]ngx-ui-switch['"]/g, "from 'src/app/shared/ui/hb-switch/hb-switch.component'");
    fs.writeFileSync(f,s);
    console.log('Fixed ' + f);
  }
});
