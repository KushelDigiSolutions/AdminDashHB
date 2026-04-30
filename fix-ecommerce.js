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
    { reg: /let\s+converter\s*=\s*require\("json-2-csv"\);/g, rep: 'import * as converter from "json-2-csv";' },
    { reg: /priceoption:\s*Options/g, rep: 'priceoption: any' },
    { reg: /this\.selected_type\s*=\s*value\.target\.value;/g, rep: 'this.selected_type = (value.target as any).value;' },
    { reg: /brandId\.length/g, rep: '(brandId as any)?.length' },
    { reg: /quantity\s*:\s*quantity\s*\|\|\s*null/g, rep: 'quantity: (quantity as any) || null' },
    { reg: /quantityRange\s*,/g, rep: 'quantityRange: quantityRange as any,' }
]);

// Fix Orders
fixFile('./src/app/pages/ecommerce/orders/orders.component.ts', [
    { reg: /let\s+converter\s*=\s*require\("json-2-csv"\);/g, rep: 'import * as converter from "json-2-csv";' },
    { reg: /endDate\s*=\s*new\s*Date/g, rep: 'endDate = (new Date() as any)' },
    { reg: /endDate\.setDate/g, rep: '(endDate as any).setDate' },
    { reg: /endDate\.getDate/g, rep: '(endDate as any).getDate' }
]);

// Fix Order Detail
fixFile('./src/app/pages/ecommerce/orders/order-detail/order-detail.component.ts', [
    { reg: /updatePaymentStatus\(data\)/g, rep: 'updatePaymentStatus(data as any)' },
    { reg: /submitCancelProducts\(form:\s*NgForm\)\s*\{/g, rep: 'submitCancelProducts(form: NgForm): void {' }
]);

// Fix Create Order
fixFile('./src/app/pages/ecommerce/orders/create-order/create-order.component.ts', [
    { reg: /onCreateOrder\(\)\s*\{/g, rep: 'onCreateOrder(): void {' }
]);

// Fix Add Menu
fixFile('./src/app/pages/ecommerce/menu/add-menu/add-menu.component.ts', [
    { reg: /value\.isLink\s*=\s*value\.isLink\s*===\s*['"]true['"];/g, rep: '(value as any).isLink = value.isLink === "true";' },
    { reg: /this\.selected_type\s*=\s*value\.target\.value;/g, rep: 'this.selected_type = (value.target as any).value;' }
]);
