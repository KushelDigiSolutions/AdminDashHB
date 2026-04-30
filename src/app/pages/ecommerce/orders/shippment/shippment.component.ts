import { firstValueFrom } from 'rxjs';
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
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../../shared/ui/ui.module';
import { EcommerceService } from '../../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { getFormatedDate } from '../../../../util/date.util';
import { Customer } from '../../customers/customers.model';
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
    NgbModalModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: "app-shippment",
  templateUrl: "./shippment.component.html",
  styleUrls: ["./shippment.component.scss"],
})
export class ShippmentComponent implements OnInit {
  orderId: string;
  shippingDetails;
  products = [];
  orderDetails;
  form: FormGroup;
  type: string;
  constructor(
    private route: ActivatedRoute,
    private apiService: EcommerceService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParams.subscribe((data) => {
      this.type = data.type;
    });

    this.route.params.subscribe((res) => {
      this.orderId = res.id;
    });

    this.form = this.formBuilder.group({
      shippingPartner: ["", [Validators.required]],
      trackingCode: ["", [Validators.required]],
      trackingUrl: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
          ),
        ],
      ],
      fee: ["", [Validators.required]],
      status: ["", [Validators.required]],
      orderId: this.orderId,
      pickup_date: ["", [Validators.required]],
      pickup_time: ["10:00", [Validators.required]],
      comments: "",
      fragile_shipment: "false",
      category_of_goods: "",
      products: this.formBuilder.array([]),
      shipment_width: [""],
      shipment_height: [""],
    });
  }

  async ngOnInit() {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.type
      ? this.apiService.getShipmentDetail(this.orderId).subscribe(
        (res: any) => {
          let shipmentData = res.data.shippingDetails[0];

          this.form.patchValue({
            shippingPartner: shipmentData.carrier,
            trackingCode: shipmentData.trackingCode,
            trackingUrl: shipmentData.trackUrl,
            fee: shipmentData.fee,
            status: shipmentData.statusDetails,
            orderId: res.data._id,
            pickup_date: this.getShipmentDate(shipmentData.date),
            comments: shipmentData.comments,
            fragile_shipment: shipmentData.fragile_shipment,
            category_of_goods: shipmentData.category_of_goods

          });
          this.mapProductsValue(shipmentData.products);
          console.log("form validation", this.form, this.form.status);
        },
        (err: any) => {
          console.log("err", err);
        }
      )
      : firstValueFrom(this.apiService.getOrderDetails(this.orderId))
        .then((res: any) => {
          this.orderDetails = res.data;
          this.shippingDetails = res.data.shippingDetails;
          this.products = res.data.products;
          this.mapProductsValue(this.products);
        })
        .catch((err: any) => {
          this.toastr.error(err.error.message);
        });
  }

  mapProductsValue(Products) {
    console.log("pt", Products)
    let value = this.form.get("products") as FormArray;
    for (let product of Products) {
      if (product.cancelledProduct >= product.quantityToShip) continue;

      console.log("product", Products);

      // return;
      value.push(
        this.createProductGroup(
          product.productId._id ? product.productId._id : product.productId,
          product.productId.productName
            ? product.productId.productName
            : product.productId.name
              ? product.productId.name
              : product.name,
          product.quantity,
          product.productId.weight ? product.productId.weight : product.weight,
          product.label,
          product.statusDetails,
          product.quantityToShip
        )
      );
    }
    console.log("form value", this.form.value);
  }

  createProductGroup(
    id: string,
    name: string,
    qty: number,
    weight: number,
    label: AbstractControl[],
    statusDetails: string,
    quantityToShip: number
  ) {
    console.log()
    return this.formBuilder.group({
      productId: [id, [Validators.required]],
      name: [{ value: name, disabled: false }, [Validators.required]],
      quantity: [{ value: qty, disabled: false }, [Validators.required]],
      weight: [weight, [Validators.required]],
      label: this.formBuilder.array(label),
      statusDetails: [statusDetails, [Validators.required]],
      quantityToShip: [
        quantityToShip,
        [Validators.required, Validators.max(qty)],
      ],
    });
  }

  getShipmentDate(date) {
    return getFormatedDate(date, "YYYY-MM-DD");
  }

  addShipment() {

    if (this.form.valid) {
      this.spinner.show();
      let valueArr = this.form.get("products") as FormArray;
      let qty = 0;
      for (let productQuantity of valueArr.value) {
        qty += productQuantity.quantityToShip;
      }
      let url = `orderId=${this.orderId}&totalQuantity=${qty}`;
      this.form.get("shippingPartner").value != "Delhivery"
        ? this.form.get("shippingPartner").value != "Other"
          ? this.createShipment(this.form.get("trackingCode").value)
          : this.createShipment("")
        : firstValueFrom(this.apiService.fetchWayBill(url))
          .then((res: any) => {
            if (res.success) {
              this.createOrder(res.data);
            }
          })
          .catch((err: any) => {
            this.toastr.error("Server Error");
            this.spinner.hide();
          });
    } else {
      if (this.form.get("products").hasError) {
        this.toastr.error(
          "Shipment Quantity can't be greater than Quantity ordered"
        );
      } else {
        this.toastr.error("Please fill all fields");
      }
    }
  }

  createOrder(waybill) {
    console.log("ordde", this.orderDetails);
    let body = {
      pickup_location: {
        pin: "245101", //
        add: "405, floor-First Floor, Shivpuri, Hapur, Uttar Pradesh, 245101 , Hapur, UTTAR PRADESH ,India 245101", //
        phone: "+918800984040",
        state: "Uttar Pradesh", //
        city: "Hapur", //
        country: "India",
        name: "Healthybazar SURFACE",
      },
      shipments: [
        {
          return_name: "Healthybazar SURFACE",
          return_pin: "245101", //
          return_city: "Hapur", //
          return_phone: "+918800984040",
          return_add:
            "405, floor-First Floor, Shivpuri, Hapur, Uttar Pradesh, 245101 , Hapur, UTTAR PRADESH ,India 245101", //hb addresss
          return_state: "Uttar Pradesh", //
          return_country: "India",
          order: this.orderId,
          phone: this.orderDetails.shippingInfo.phone,
          products_desc:
            this.orderDetails.products.length > 1
              ? this.orderDetails.products.reduce(
                (prevName, currName, index) => {
                  return index == 0
                    ? currName.productName
                    : prevName.productName + "," + currName.productName;
                }
              )
              : this.orderDetails.products[0].productName, //product name
          cod_amount: "65.0", //
          name: this.orderDetails.user.firstName
            ? this.orderDetails.user.firstName
            : this.orderDetails.user._id + " " + this.orderDetails.user.lastName
              ? this.orderDetails.user.lastName
              : "Hb Customer",
          country: "India",
          waybill: waybill,
          seller_inv_date: "", //
          order_date: this.orderDetails.createdAt,
          total_amount: this.orderDetails.totalPayableAmount,
          seller_add: "", //
          seller_cst: "", //
          seller_name: "", //
          seller_inv: "", //
          seller_tin: "", //
          quantity: "1", //
          fragile_shipment: this.form.get("fragile_shipment").value,
          category_of_goods: this.form.get("category_of_goods").value,
          payment_mode:
            this.orderDetails.paymentMethod == "cod" ||
              this.orderDetails.paymentMethod == "cash"
              ? "COD"
              : "Prepaid",
          add:
            this.orderDetails.shippingInfo.address.houseNumber +
            this.orderDetails.shippingInfo.address.line1 +
            this.orderDetails.shippingInfo.address?.line2,
          pin: this.orderDetails.shippingInfo.address.pinCode,
          state: this.orderDetails.shippingInfo.address.state,
          city: this.orderDetails.shippingInfo.address.city,
          address_type: this.orderDetails.shippingInfo.address.type || "home",
          client: "HealthybazarSURFACE-B2C",
          shipment_width: this.form.get("shipment_width").value,
          shipment_height: this.form.get("shipment_height").value,
          shipping_mode: "Surface",
        },
      ],
    };
    
    this.apiService.createShipmentsOrder(body).subscribe(
      (res: any) => {
        if (res.success) {
          console.log("cr", res);
          this.createPackagingSlip(waybill);
        }
      },
      (err) => {
        console.log("err", err);
        this.spinner.hide();
        this.toastr.error("Error in Create Shipments Order");
      }
    );
  }
  createPackagingSlip(waybill) {
    this.apiService.createPackagingSlip(waybill).subscribe(
      (res: any) => {
        if (res.success) {
          this.createPickupRequest(waybill);
        }
      },
      (err) => {
        console.log("er", err);
        this.spinner.hide();
        this.toastr.error("Error in Create Package Slip");
      }
    );
  }
  createPickupRequest(waybill) {
    let { value } = this.form;
    let body = {
      pickup_time: value.pickup_time,
      pickup_date: value.pickup_date,
      pickup_location: environment.pickupLocation,
      expected_package_count: this.products.length,
    };
    this.apiService.createPickUpRequest(body).subscribe(
      (res: any) => {
        if (res.success) {
          this.createShipment(waybill);
        }
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error("Error in Create Pickup Request");
      }
    );
  }
  createShipment(waybill) {
    let value = this.form.value;
    value.waybill = waybill;
    firstValueFrom(this.apiService.createShipment(value))
      .then((res: any) => {
        this.router.navigate([`ecommerce/orders/order-detail/${this.orderId}`]);
        this.form.reset();
        this.toastr.success(res.message);
        this.spinner.hide();
      })
      .catch((err: any) => {
        this.spinner.hide();
        this.toastr.error("Error in Create Shipment");
      });
  }

  onChangeShippingPartner(value) {
    if (value == "Delhivery") {
      this.form.controls.trackingCode.disable();
      this.form.controls.trackingUrl.disable();
      this.form.controls.fee.disable();
      this.form.controls.status.disable();
    } else if (value == "Other") {
      this.form.controls.fee.enable();
      this.form.controls.status.enable();
    } else {
      this.form.controls.trackingCode.enable();
      this.form.controls.trackingUrl.enable();
      this.form.controls.fee.enable();
      this.form.controls.status.enable();
    }
  }
  updateShipment() {
    this.spinner.show();
    let data = {
      shippingId: this.orderId,
      trackingCode: this.form.get("trackingCode").value,
      shippingPartner: this.form.get("shippingPartner").value,
      orderId: this.form.get("orderId").value,
      fee: this.form.get("fee").value,
      statusDetails: this.form.get("status").value,
      trackingUrl: this.form.get("trackingUrl").value,
      products: this.form.get("products").value,
      comments: this.form.get("comments").value,
      pickup_time: this.form.get("pickup_time").value,
      pickup_date: this.form.get("pickup_date").value,
    };

    this.apiService.updateShipment(data).subscribe(
      (res: any) => {
        this.router.navigate([
          `ecommerce/orders/order-detail/${this.form.get("orderId").value}`,
        ]);
        this.toastr.success(res.message);
        this.spinner.hide();
      },
      (err) => {
        console.log("ERROR", err);
      }
    );
  }
  onChangefragile() {
    console.log("here", this.form.get("fragile_shipment").value);
    console.log("val", this.form.value);
  }
}
