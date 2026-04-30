import { Injectable } from '@angular/core';
import { Alignment, Border, Borders, Workbook } from "exceljs";
import saveAs from "file-saver";
import { getFormatedDate } from 'src/app/util/date.util';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {

  paytmDeductionGST = 18;
  paytmDeductionRates = {
    UPI: { fee: 0 },
    PPI: { fee: 1.99 },
    WALLET: { fee: 1.99 },
    DC: { fee: 1.9, ranges: { 2001: 0.4 } },
    CC: { fee: 1.99 },
    NB: { fee: 1.99 },
    IDC: { fee: 2.9 },
    ICC: { fee: 2.9 },
  };

  constructor(

  ) { }

  calculatePayTmDeduction(amount, method) {
    method = this.paytmDeductionRates[method]
    if (method) {
      let { fee } = method;
      if (method.ranges) {
        let rangeKeys = Object.keys(method.ranges).map(el => parseInt(el)).sort((a, b) => a - b);
        let index = rangeKeys.findIndex(el => amount < el);
        if (index != -1) {
          method.ranges[rangeKeys[index]]
        }
      }
      let txnFee = amount * fee / 100;
      let txnGST = txnFee * this.paytmDeductionGST / 100;
      let deduction = Math.ceil(txnFee + txnGST);
      return deduction;
    }
    return 0;
  }

  downloadOrdersGSTSheet(orders: any[], filename = 'orders-gst-invoice') {
    const workbook = new Workbook()
    workbook.creator = 'HealthyBazar';
    workbook.lastModifiedBy = 'Admin';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    let worksheet = workbook.addWorksheet("Orders Data");
    let rows = [
      ["TATVAMASMI CONSULTING SERVICES PVT LTD"]
      ["1st Floor, 405,Shivpuri"],
      ["Hapur"],
      ["CIN: U85100UP2021PTC140172, GSTIN: 09AAICT3465B1ZC"],
      ["Contact : 8800984040, snehil.hridaya@healthybazar.com"],
      ["Sales Register"],
    ];

    rows.forEach((el, index) => {
      let row = worksheet.addRow(el);
      row.font = { bold: true }
      worksheet.mergeCells(index + 1, 1, index + 1, 5)
    });

    let headers = ["Date", "Order No.", "Particulars", "Qty", "Consignee/Buyer", "Voucher Type", "Voucher No.", "Voucher Ref. No.", "MRP", "CGST", "SGST", "VAT", "Selling Price", "Discount", "Margin", "Payment Mode", "Shipment Paid by Customer", "Coupon Discount", "Total", "Refund", "Paytm Deduction", "Shipment Paid by HB", "Shipment Carriers", "Tracking Codes", "Gross Total", "Profile / Loss", "State", "Pincode"];

    let row = worksheet.addRow(headers);
    row.font = { bold: true }
    let borderStyle: Partial<Border> = { color: { argb: '555555' }, style: 'thin' };

    row.eachCell((cell, colNumber) => {
      cell.style.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffe7e7e7' } }
      cell.border = { top: borderStyle, right: borderStyle, bottom: borderStyle, left: borderStyle }
      cell.font = { ...cell.font, size: 11 }
      console.log('[colNumber]', colNumber);

    });

    let columns: { colName: string, width: number, alignment: Partial<Alignment> }[] = [
      { colName: "A", width: 15, alignment: { vertical: "top", wrapText: true } },
      { colName: "B", width: 8, alignment: { vertical: "top", wrapText: true } },
      { colName: "C", width: 40, alignment: { vertical: "top", wrapText: true } },
      { colName: "D", width: 10, alignment: { vertical: "top", wrapText: true } },

      { colName: "E", width: 20, alignment: { vertical: "top", wrapText: true } },
      { colName: "F", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "G", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "H", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "I", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "J", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "K", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "L", width: 8, alignment: { vertical: "top", wrapText: true } },
      { colName: "M", width: 8, alignment: { vertical: "top", wrapText: true } },
      { colName: "N", width: 8, alignment: { vertical: "top", wrapText: true } },
      { colName: "O", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "P", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "Q", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "R", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "S", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "T", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "U", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "V", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "W", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "X", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "Y", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "Z", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "AA", width: 10, alignment: { vertical: "top", wrapText: true } },
      { colName: "AB", width: 10, alignment: { vertical: "top", wrapText: true } },
    ]
    columns.forEach((el, index) => {
      let col = worksheet.getColumn(el.colName);
      col.width = el.width;
      col.alignment = { ...col.alignment, ...el.alignment }
    })

    worksheet.addRow([]);

    orders.forEach((tempOrder, index) => {
      let { createdAt, orderId, billingInfo, totalPayableAmount, shippingCharges, shippingDetails, currentStatus, products, paymentMethod, paymentType, refundStatus } = tempOrder;

      let paytmDeduction = 0;
      if (paymentType == 'paytm') {
        paytmDeduction = this.calculatePayTmDeduction(totalPayableAmount, paymentMethod)
      }
      let carriers = shippingDetails.map(el => el.carrier).join(', ');
      let trackingCodes = shippingDetails.map(el => el.trackingCode).join(', ');

      let shippingChargesPaidByHB = shippingDetails.reduce((total, el) => {
        total += parseInt(el.fee)
        return total;
      }, 0);

      let refundAmount = refundStatus.reduce((total, el) => total += Number(el.refundAmount || 0), 0);

      let row1 = [
        getFormatedDate(createdAt, "DD-YYYY-MMM"),
        '#' + orderId,
        (billingInfo.firstName || '') + ' ' + (billingInfo.lastName || ''),
        "",
        (billingInfo.firstName || '') + ' ' + (billingInfo.lastName || ''),
        "Sales",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        paymentMethod == "cod" ? "COD" : paymentMethod,
        shippingCharges,
        "",
        totalPayableAmount,
        -refundAmount,
        -paytmDeduction,
        -shippingChargesPaidByHB,
        carriers,
        trackingCodes,
        totalPayableAmount - paytmDeduction - shippingChargesPaidByHB - refundAmount,
        0,
        billingInfo.address.state,
        billingInfo.address.pinCode,
      ];

      let row = worksheet.addRow(row1);
      row.eachCell(cell => {
        cell.font = { bold: true };
        if (currentStatus == 'cancelled') {
          cell.font = {
            ...cell.font,
            color: { argb: "ffffff" }
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ef3939" }
          };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "fff4f4f4" }
          };
        }
      })
      products.forEach(product => {
        let { productName, mrp, productPrice, margin, taxClass, quantity, quantityToShip } = product;
        let discount = '0%';

        if (productPrice && mrp) {
          discount = (Number((mrp - productPrice) / mrp * 100).toFixed(2)) + '%';
        }

        let rowData = [
          "", /**A */
          "", /**B */
          productName, /**C */
          quantity,  /**D */
          "", /**E */
          "", /**F */
          "", /**G */
          "", /**H */
          mrp, /**I */
          "", /**J */
          5, /**K */
          "", /**L */
          productPrice, /**M */
          discount, /**N */
          margin || 0, /**O */
          "", /**P */
          "", /**Q */
          "", /**R */
          "", /**S */
          "", /**T */
          "", /**U */
          "", /**V */
          "", /**W */
          "", /**X */
          "", /**Y */
          "", /**Z */
        ];
        let row = worksheet.addRow(rowData);
      })


      worksheet.addRow([])
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}
