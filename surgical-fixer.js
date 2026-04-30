const fs = require('fs');

const targets = [
  './src/app/pages/ecommerce/addproduct/addproduct.component.ts',
  './src/app/pages/ecommerce/orders/shippment/shippment.component.ts',
  './src/app/pages/ecommerce/orders/create-order/create-order.component.ts',
  './src/app/pages/ecommerce/coupons/add-coupons/add-coupons.component.ts'
];

targets.forEach(f => {
  if (!fs.existsSync(f)) return;
  let txt = fs.readFileSync(f, 'utf8');
  
  // 1. Remove broken import blocks starting with "import {" but never finishing correctly
  // specifically targeting the ones like "import { AbstractControl... Validators, import *"
  txt = txt.replace(/import\s*{\s*AbstractControl[\s\S]*?import/g, 'import');
  
  // 2. Fix the return toastr mismatch in create-order.component.ts
  if (f.includes('create-order.component.ts')) {
    txt = txt.replace(/return this\.toastr\.error\(([^)]+)\);/g, 'this.toastr.error($1); return;');
  }
  
  // 3. Fix environment import if mangled
  txt = txt.replace(/import\s*{\s*environment\s*\}\s*from\s*"src\/environments\/environment";/g, 'import { environment } from "src/environments/environment";');
  
  // 4. Remove any leading commas in decorators that might have stayed
  txt = txt.replace(/@Component\(\{\s*standalone:\s*true,\s*imports:\s*\[[\s\S]*?\]\s*,\s*selector/g, matched => {
      return matched.replace('], , selector', '], selector');
  });

  fs.writeFileSync(f, txt, 'utf8');
  console.log('Surgically Fixed: ' + f);
});
