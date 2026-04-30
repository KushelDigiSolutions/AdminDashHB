const fs = require('fs');

let ordersFile = 'src/app/pages/ecommerce/orders/orders.component.ts';
let awaitedFile = 'src/app/pages/ecommerce/awaited-order/awaited-order.component.ts';

function wrapInSetTimeout(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const target = `            this.ordersData = res.data;
            this.orders = res.data.orders;
            this.cdr.detectChanges();`;

  const replacement = `            setTimeout(() => {
              this.ordersData = res.data;
              this.orders = res.data.orders;
              this.cdr.detectChanges();
            });`;
            
  if(content.includes(target.replace(/\r\n/g, '\n'))) {
        content = content.replace(target.replace(/\r\n/g, '\n'), replacement);
  } else if(content.includes(target.replace(/\n/g, '\r\n'))){
        content = content.replace(target.replace(/\n/g, '\r\n'), replacement);
  } else {
      console.log("Could not find target in " + filePath);
  }

  const target2 = `            this.ordersForDownload = res.data.orders;
            this.downloadCSV();`;

  const replacement2 = `            setTimeout(() => {
              this.ordersForDownload = res.data.orders;
              this.downloadCSV();
            });`;

  if(content.includes(target2.replace(/\r\n/g, '\n'))) {
        content = content.replace(target2.replace(/\r\n/g, '\n'), replacement2);
  } else if(content.includes(target2.replace(/\n/g, '\r\n'))){
        content = content.replace(target2.replace(/\n/g, '\r\n'), replacement2);
  }

  fs.writeFileSync(filePath, content);
}

wrapInSetTimeout(ordersFile);
wrapInSetTimeout(awaitedFile);

console.log('SetTimeout wrapped successfully!');
