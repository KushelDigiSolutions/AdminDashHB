const fs = require('fs');
let b = fs.readFileSync('src/app/pages/ecommerce/orders/orders.component.ts', 'utf8');

const target = `    this.apiService
      .getOrdersList(params)
      .toPromise()
      .then((res: any) => {
        this.spinner.hide();
        if (res.data) {
          res.data.orders = res.data.orders.map((order) => {
            console.log("[paymentType]", order.paymentType);
            if (order.billingInfo) {
              order.billingInfo.fullName = this.getFullName(order.billingInfo)
              order.billingInfo.fullAddress = this.getFullAddress(order.billingInfo)
            }
            if (order.shippingInfo) {
              order.shippingInfo.fullName = this.getFullName(order.shippingInfo)
              order.shippingInfo.fullAddress = this.getFullAddress(order.shippingInfo)
            }
            order.isRefundable = this.checkIsRefundable(order);
            return order;
          });

          this.ordersData = res.data;
          this.orders = res.data.orders;

          console.log("ord", this.orders);
          this.orders.forEach((el, i) => {
            // console.log(i, '[couponDiscount]', el.couponDiscount);
          });
        }
      })
      .catch((err: any) => {
        this.spinner.hide();
      });`;

const replacement = `    this.apiService
      .getOrdersList(params)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            res.data.orders = res.data.orders.map((order) => {
              console.log("[paymentType]", order.paymentType);
              if (order.billingInfo) {
                order.billingInfo.fullName = this.getFullName(order.billingInfo)
                order.billingInfo.fullAddress = this.getFullAddress(order.billingInfo)
              }
              if (order.shippingInfo) {
                order.shippingInfo.fullName = this.getFullName(order.shippingInfo)
                order.shippingInfo.fullAddress = this.getFullAddress(order.shippingInfo)
              }
              order.isRefundable = this.checkIsRefundable(order);
              return order;
            });

            this.ordersData = res.data;
            this.orders = res.data.orders;
            this.cdr.detectChanges();

            console.log("ord", this.orders);
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        }
      });`;

b = b.replace(target.replace(/\r\n/g, '\n'), replacement);
b = b.replace(target.replace(/\n/g, '\r\n'), replacement);

fs.writeFileSync('src/app/pages/ecommerce/orders/orders.component.ts', b);
console.log('Replaced successfully');
