import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgModel, NgForm, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule, NgbDatepickerModule, NgbModalModule, NgbModal, NgbActiveModal, NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../shared/ui/ui.module';
import { EcommerceService } from '../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction';
import { NgbdSortableHeader, SortEvent } from '../sortable-directive';
import { RemoveModalComponent } from '../modals/remove/remove-modal/remove-modal.component';
import { RefundModalComponent } from '../modals/refund/refund-modal/refund-modal.component';
import { getFormatedDate } from '../../../util/date.util';
import { PdfService } from '../../../core/services/pdf.service';
import { CsvService } from '../../../core/services/csv.service';
import { SheetsService } from '../../../core/services/sheets.service';
import { saveAs } from 'file-saver';
import { ToWords } from 'to-words';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const FILTER_PAG_REGEX = /[^0-9]/g;
import html2pdf from 'html2pdf.js';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    UIModule,
    NgSelectModule,
    DropzoneModule,
    NgbModalModule,
    NgbdSortableHeader
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  providers: [TransactionService, DecimalPipe],
})

/**
 * Ecommerce orders component
 */
export class OrdersComponent implements OnInit {
  @ViewChild("invoiceModal") invoiceModal;

  breadCrumbItems: Array<{}>;

  invoice: any;

  term: any;
  ordersData: any = {
    count: 0,
    orders: [],
  };
  orders = [];
  ordersForDownload = [];
  cancelableStatus = ["placed", "hold", "processing"];

  page: number;
  pageSize: number;
  search: string = "";
  searchOrders: Array<any> = [];

  currentDate = new Date();
  maxDate = getFormatedDate(this.currentDate, "YYYY-MM-DD");

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  recordsList = [];
  recordsFG = this.fb.group({
    startDate: [
      getFormatedDate(
        new Date(this.currentDate).setDate(this.currentDate.getDate() - 1),
        "YYYY-MM-DD"
      ),
      [Validators.required],
    ],
    endDate: [getFormatedDate(this.currentDate, "YYYY-MM-DD")],
    type: "slips",
  });

  filterFG = this.fb.group({
    orderId: "",
    paymentStatus: "",
    orderStatus: "",
    user: "",
    startDate: "",
    endDate: "",
  });

  orderFilters = {
    startDate: "",
    endDate: "",
    orderId: "",
    paymentStatus: "",
    currentStatus: "",
    user: "",
  };
  sort = '';
  paymentStatus = ["failed", "accepted", "awaited", "refunded"];

  orderStatus = [
    "placed",
    "hold",
    "processing",
    "dispatched",
    "delivered",
    "cancelled",
    "completed",
    "paymentAwaited",
    "failed",
    "refunded",
    "partialRefunded",
    "refundInitiated",
    "partialRefundInitiated",
    "outForDelivery",
  ];

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public service: TransactionService,
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pdf: PdfService,
    private csv: CsvService,
    private sheets: SheetsService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [
          { label: "Ecommerce" },
          { label: "Orders", active: true },
        ];

        this.route.queryParams.subscribe((res: any) => {
          setTimeout(() => {
            console.log("res", res);
            this.pageSize = res.limit ? parseInt(res.limit) : 10;
            this.page = res.page ? parseInt(res.page) : 1;
            this.getOrdersList();
          });
        });
    });
  }
  getOrdersList() {
    let params = { limit: this.pageSize, page: this.page, ...this.orderFilters, sort: this.sort };

    this.spinner.show();
    this.apiService
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

            setTimeout(() => {
              this.ordersData = res.data;
              this.orders = res.data.orders;
              this.cdr.detectChanges();
            });

            console.log("ord", this.orders);
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        }
      });
  }

  checkIsRefundable(order) {
    return order.paymentType != "cash" && !order.refundInitiatedIds.length &&
      (order.currentStatus == "cancelled" ||
        Boolean(order.products.find((product) => product.statusDetails == "cancelled")));
  }

  deleteOrder(order) {
    let id = order._id;
    const data = {
      value: "Order",
    };

    let modal = this.modal.open(RemoveModalComponent, { size: "lg" });

    modal.componentInstance.data = data;

    modal.result
      .then(
        (result) => {
          if (result == "yes") {
            this.apiService.deleteOrder(id).subscribe(
              (res: any) => {
                this.toastr.success("Order removed Successfully");
                this.getOrdersList();
              },
              (err) => {
                this.toastr.error(err.error.message);
              }
            );
          }
        },
        (reason) => {
          console.log("reas", reason);
        }
      )
      .catch((reason) => {
        console.log("cat", reason);
      });
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
    this.getOrdersList();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, "");
  }

  change() {
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
  }

  changeValue(event, type) {
    if (type == "page") {
      this.page = event;
    }
    if (this.search) {
      this.orders = this.searchOrders.slice(
        (this.page - 1) * this.pageSize,
        this.page * this.pageSize
      );
      this.router.navigate([], {
        queryParams: { limit: this.pageSize, page: this.page },
        relativeTo: this.route,
      });
    } else {
      // this.getOrdersList();
      this.router.navigate([], {
        queryParams: { limit: this.pageSize, page: this.page },
        relativeTo: this.route,
      });
    }
  }

  onSearch(form: NgForm) {
    this.search = form.value.searchTerm.trim();
    this.page = 1;
    if (this.search) {
      this.apiService.algoliaSearch(this.search).subscribe((res) => {
        this.searchOrders = res.data1.hits;
        this.orders = this.searchOrders.slice(
          (this.page - 1) * this.pageSize,
          this.page * this.pageSize
        );
        this.ordersData.count = res.count;
      });
    } else {
      this.getOrdersList();
    }
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;

    switch (column as string) {
      case 'date': {
        if (direction == 'asc') {
          this.sort = 'ascDate';
        } else if (direction == 'desc') {
          this.sort = 'descDate';
        } else {
          this.sort = '';
        }
        break;
      }
      default: {
        this.sort = '';
      }
    }
    this.getOrdersList();
  }

  onCancelOrder(order, i) {
    let { _id, orderId } = order;
    if (confirm("Are you sure want to cancel this order: #" + orderId)) {
      this.spinner.show();
      this.apiService.cancelOrder(_id).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.status) {
            let { data } = res
            let order = this.ordersData.orders[i];
            order.currentStatus = data.currentStatus;
            order.status = data.status
            order.isRefundable = this.checkIsRefundable(data);
            this.toastr.success("Order has been cancelled");
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error("Something went wrong!");
        }
      );
      console.log("cancelling");
    }
  }

  refundOrder(data) {
    let modal = this.modal.open(RefundModalComponent, { size: "lg" });

    modal.componentInstance.data = data;

    modal.result.then((result) => {
      if (result == "success") {
        this.getOrdersList();
      }
      if (result == "true") {
        this.router.navigate([], {
          queryParams: { limit: this.pageSize, page: this.page },
          relativeTo: this.route,
        });
      }
    });
  }

  filterOrders() {
    this.orderFilters.currentStatus =
      this.filterFG.get("orderStatus").value || "";
    this.orderFilters.paymentStatus =
      this.filterFG.get("paymentStatus").value || "";
    this.orderFilters.user = this.filterFG.get("user").value || "";
    this.orderFilters.orderId = this.filterFG.get("orderId").value || "";
    this.orderFilters.startDate = this.filterFG.get("startDate").value || "";
    this.orderFilters.endDate = this.filterFG.get("endDate").value || "";

    if (this.orderFilters.endDate) {
      let date = new Date(this.orderFilters.endDate);
      date.setDate(date.getDate() + 1)
      this.orderFilters.endDate = getFormatedDate(date)
    }

    this.getOrdersList();
  }

  resetFilters() {
    this.filterFG.reset();
    this.getOrdersList();
  }
  closeRecords() {
    this.recordsList = [];
  }

  getRecords() {
    let { startDate, type } = this.recordsFG.value;
    let endDateObj: Date;
    if (this.recordsFG.value.endDate) {
      endDateObj = new Date(this.recordsFG.value.endDate);
    } else {
      endDateObj = new Date();
    }

    endDateObj.setDate(endDateObj.getDate() + 1);
    let endDate = getFormatedDate(endDateObj, "YYYY-MM-DD");
    let params = { startDate, endDate };

    this.spinner.show();
    if (type == "slips" || type == "gstInvoice") {
      this.apiService
        .getOrdersList(params)
        .subscribe(
          (res: any) => {
            this.spinner.hide();

            if (res.data) {
              if (!res.data.orders.length)
                this.toastr.warning(
                  "No records were found of selected dates."
                );
              res.data.orders = res.data.orders.map((order) => {
                if (order.billingInfo) {
                  order.billingInfo.fullName = this.getFullName(order.billingInfo)
                  order.billingInfo.fullAddress = this.getFullAddress(order.billingInfo)
                }
                if (order.shippingInfo) {
                  order.shippingInfo.fullName = this.getFullName(order.shippingInfo)
                  order.shippingInfo.fullAddress = this.getFullAddress(order.shippingInfo)
                }
                return order;
              });
              if (type == 'slips') {
                this.recordsList = res.data.orders;
                window.scroll(0, 0);
              } else {
                this.sheets.downloadOrdersGSTSheet(res.data.orders.filter(order => {
                  return order.paymentMethod !== "" && (order.paymentMethod == "cod" ? true : order.paymentStatus == 'accepted')
                }));
              }

            }
          },
          (err: HttpErrorResponse) => {
            this.spinner.hide();
            this.toastr.error("Something went wrong");
          }
        )
    } else if (type == "invoices") {
      this.apiService.getInvoicesBulk(params).subscribe(
        (res: any) => {
          if (res.status) {
            this.apiService.sendInvoices().subscribe(
              (res: any) => {
                this.toastr.success(
                  "Invoice sent to specified email Address"
                );
                this.spinner.hide();
              },
              (err: HttpErrorResponse) => {
                this.toastr.error("Something went wrong");
                this.spinner.hide();
              }
            );
          }
        },
        (err: any) => {
          this.toastr.error("Something went wrong");
          this.spinner.hide();
        }
      )

    } else {

    }
  }

  getFullName(data) {
    return ((data.firstName || '') + ' ' + (data.lastName || '')).trim();
  }

  getFullAddress(data) {
    let addressKeys = ["houseNumber", "line1", "line2", "city", "state", "country"];
    let fullAddress = addressKeys
      .map((key) => {
        return data.address[key];
      })
      .filter((el) => Boolean(el))
      .join(", ");
    fullAddress += ' - ' + data.address.pinCode;
    return fullAddress;
  }
  onDownloadRecords() {
    window.scroll(0, 0);
    this.spinner.show();
    setTimeout(() => {
      let { startDate, endDate } = this.recordsFG.value;
      this.pdf.downloadPDF(
        ".recordsList",
        `Orders-from-${startDate}-to-${endDate}.pdf`
      );
    }, 2000);
  }

  downloadPDF(selector, name) {
    let node = document.querySelector(selector);
    var opt = {
      margin: 1,
      filename: name,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "mm", orientation: "portrait" },
    };

    this.spinner.show();
    html2pdf()
      .from(node)
      .set(opt)
      .save()
      .then(() => {
        this.spinner.hide();
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  openInvoiceModal(invoiceData) {
    this.invoice = JSON.parse(JSON.stringify(invoiceData));
    let { firstName, lastName, address } = this.invoice.billingInfo;
    this.invoice.billingInfo.fullName = ((firstName || '') + ' ' + (lastName || '')).trim();
    this.invoice.couponDiscount = Math.round(this.invoice.couponDiscount || 0)
    
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
      },
    });

    let words = toWords.convert(this.invoice.totalPayableAmount);

    this.invoice.amountInWords = words;

    this.modalService.open(this.invoiceModal, {
      size: "xl",
      windowClass: "modal-holder",
      centered: true,
    });
    window.scroll(0, 0);
  }

  downloadInvoice(invoiceId) {
    this.pdf.downloadPDF(".invoiceCont", `Invoice-${invoiceId}.pdf`);
  }

  onDownloadButton(){
    this.orderFilters.currentStatus =
    this.filterFG.get("orderStatus").value || "";
  this.orderFilters.paymentStatus =
    this.filterFG.get("paymentStatus").value || "";
  this.orderFilters.user = this.filterFG.get("user").value || "";
  this.orderFilters.orderId = this.filterFG.get("orderId").value || "";
  this.orderFilters.startDate = this.filterFG.get("startDate").value || "";
  this.orderFilters.endDate = this.filterFG.get("endDate").value || "";

  if (this.orderFilters.endDate) {
    let date = new Date(this.orderFilters.endDate);
    date.setDate(date.getDate() + 1)
    this.orderFilters.endDate = getFormatedDate(date)
  }
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const threeMonthAgo = new Date();
  threeMonthAgo.setMonth(today.getMonth() - 3);
  const startDateControl = this.filterFG.get('startDate');
  let startDate = startDateControl?.value ? new Date(startDateControl.value) : null;

  //default case where no date provided by user
  if(this.orderFilters.startDate =="" && this.orderFilters.endDate ==""){
    this.orderFilters.startDate = getFormatedDate(threeMonthAgo);
    this.orderFilters.endDate = getFormatedDate(today);
    console.log("START DATE:", this.orderFilters.startDate, "END DATE: ", this.orderFilters.endDate);
  }
  if(this.orderFilters.startDate !=="" && this.orderFilters.endDate ==""){
    this.orderFilters.endDate = getFormatedDate(today);
  }

  console.log("START DATE:", startDate, "Three month ago: ", threeMonthAgo);
  let threeMonthDate = getFormatedDate(threeMonthAgo);
  //If user provide date older than 3 months
  if (getFormatedDate(this.orderFilters.startDate) < getFormatedDate(threeMonthAgo)) {
    //this.toastr.warning("Start Date should not be older than 3 months from today.");
    this.toastr.warning("Bhosdike paise lagenge paise...");
    //alert('Start date cannot be more than 1 month in the past.');
    return;
  }  

  this.getOrderListForDownload()

  }

  getOrderListForDownload() {
    let params = { ...this.orderFilters, sort: this.sort };

    this.spinner.show();
    this.apiService
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

            setTimeout(() => {
              this.ordersForDownload = res.data.orders;
              this.downloadCSV();
            });
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        }
      });
  }
  downloadCSV() {
    if (!this.ordersForDownload.length) return;
    let fields = [];
    const headers = Object.keys(this.ordersForDownload[0]);
    let csv = headers.join(',') + '\n';

    this.ordersForDownload.forEach(order => {
      csv += headers.map(h => `"${order[h]}"`).join(',') + '\n';
      let listOfProductsInOrder = [];
      let orderStatus;
      if(order.products.length > 0){
        order.products.forEach((item) => {
          //listOfProductsInOrder += item.productName;
          listOfProductsInOrder.push(item.productName+" ["+item.seller+"]" + " Qty: "+ item.quantity);
        });
      }

      let document = {
        "Order ID":order.orderId,
        "Date": order.createdAt,
        "Shipping Name": order.shippingInfo.firstName +" "+ order.shippingInfo.lastName,
        "Mobile No": order.shippingInfo.phone,
        "Ship to Pincode": order.shippingInfo.address.pinCode,
        //"Product": listOfProductsInOrder,
        "Product": listOfProductsInOrder.join(', '),
        "Total MRP": order.totalMrp.toFixed(2),
        "Order Value (Including Shipping)": order.totalPayableAmount.toFixed(2),
        "Payment Method":order.paymentType,
        "Order Status": order.currentStatus
        }
        fields.push(document);
    });

    try {
      this.csv.downloadCSV(fields, 'orders_' + getFormatedDate(new Date()));
    } catch(err) {
      console.log("ERROR: " + err.message);
    }
  }

  downLoadCsvFile(csv){
    // Deprecated, handled by csv service
  }
}
