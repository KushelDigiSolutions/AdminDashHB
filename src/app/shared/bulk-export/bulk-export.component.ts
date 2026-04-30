import { Component, Input, OnInit } from "@angular/core";
import moment from "moment";
import saveAs from "file-saver";
import { ToastrService } from "ngx-toastr";
import { CsvService } from "../../core/services/csv.service";

@Component({
  standalone: false,
  selector: "app-bulk-export",
  templateUrl: "./bulk-export.component.html",
  styleUrls: ["./bulk-export.component.scss"],
})
export class BulkExportComponent implements OnInit {
  exportData = [];

  @Input()
  set data(data: any) {
    this.exportData = data;
  }
  get data(): any {
    return this.exportData;
  }

  @Input() type: string;

  constructor(
    private toaster: ToastrService,
    private csvService: CsvService
  ) {}

  ngOnInit(): void {
    console.log("orders", this.data);
  }

  exportList(data) {
    let fields = [];

    if (this.type == "order") {
      data.forEach((element) => {

        let value = "";
        element.products.forEach((el) => {
          value = el.productName + ","+value;
        });

        let document = {
            "Order": element.orderId,
            "Purchased On":moment(element.createdAt).format("DD-MMM-YYYY h:mm:ss a"),
            "Bill to Name": element.billingInfo.firstName + (element.billingInfo.lastName
                ? element.billingInfo.lastName
                : '' ),
            "Ship to Name": element.shippingInfo.firstName + (element.shippingInfo.lastName
                ? element.shippingInfo.lastName
                : ''), 
            "Order from City":element.shippingInfo.address.city,
            "Postcode": element.shippingInfo.address.pinCode,
            "Product Name": value,
            "Grand Total (Purchased)":element.totalPayableAmount,
            "Order Status": element.currentStatus,
            "Payment Status": element.paymentStatus
          }
        fields.push(document);
      });

      try {
        const csv = this.csvService.jsonToCsv(fields);
        this.toaster.success("Csv file downloaded");
        this.downLoadCsvFile(csv);
      } catch (err: any) {
        console.log("ERROR: " + err.message);
      }
    }
  }

  downLoadCsvFile(csv) {
    let blob = new Blob([csv], { type: "text/csv" });

    if (this.type == "order") {
      saveAs(blob, `orders.csv`);
    }
  }
}
