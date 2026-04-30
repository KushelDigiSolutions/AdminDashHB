const fs = require('fs');

function fixFile(path, fixes) {
    if (!fs.existsSync(path)) return;
    let txt = fs.readFileSync(path, 'utf8');
    fixes.forEach(f => {
        txt = txt.replace(f.reg, f.rep);
    });
    fs.writeFileSync(path, txt, 'utf8');
}

// Fix Products
fixFile('./src/app/pages/ecommerce/products/products.component.ts', [
    { reg: /let\s+\{\s*brandId,\s*active,\s*quantity,\s*quantityRange:\s*quantityRange\s*as\s*any,\s*outOfStock\s*\}\s*=\s*value;/g, 
      rep: 'let { brandId, active, quantity, quantityRange, outOfStock } = value as any;' },
    { reg: /status:\s*[""]\s*,/g, rep: '/* status: "", */' }
]);

// Fix Create Order return toastr
fixFile('./src/app/pages/ecommerce/orders/create-order/create-order.component.ts', [
    { reg: /if\s*\(!this\.selected_products\.length\)\s*return\s*this\.toastr\.error\(['"]Please select products first\.['"]\);/g, 
      rep: 'if (!this.selected_products.length) { this.toastr.error("Please select products first."); return; }' },
    { reg: /if\s*\(!this\.subOrder\)\s*return\s*this\.toastr\.error\(['"]Invalid sub order details['"]\);/g, 
      rep: 'if (!this.subOrder) { this.toastr.error("Invalid sub order details"); return; }' },
    { reg: /if\s*\(this\.orderForm\.invalid\)\s*return\s*this\.toastr\.error\(['"]Please fill all required fields['"]\);/g, 
      rep: 'if (this.orderForm.invalid) { this.toastr.error("Please fill all required fields"); return; }' },
    { reg: /if\s*\(!this\.selectedUser\)\s*return\s*this\.toastr\.error\(['"]Invalid recipient detail['"]\);/g, 
      rep: 'if (!this.selectedUser) { this.toastr.error("Invalid recipient detail"); return; }' },
    { reg: /return\s+this\.toastr\.error\(['"]Please select user address or clinic address.['"]\);/g, 
      rep: '{ this.toastr.error("Please select user address or clinic address."); return; }' }
]);

// Fix Order Detail return toastr
fixFile('./src/app/pages/ecommerce/orders/order-detail/order-detail.component.ts', [
    { reg: /if\(!products\.length\)\s*return\s*this\.toastr\.error\(['"]Please select products to cancel['"]\);/g, 
      rep: 'if(!products.length) { this.toastr.error("Please select products to cancel"); return; }' }
]);
