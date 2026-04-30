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
import { UIModule } from '../../../../shared/ui/ui.module';
import { EcommerceService } from '../../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { getFormatedDate } from '../../../../util/date.util';
import { map } from 'rxjs/operators';

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
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('paymentLinkModal') paymentLinkModal;
  @ViewChild("medicalAttachmentModal") medicalAttachmentModal: ElementRef;

  breadCrumbItems: Array<{}>;
  orderId: string;
  orderDetails: any;
  products = [];
  shipments = [];
  activeTab = 1;

  showTxnInfoForm = false;
  paymentFormGroup = this.fb.group({
    paymentType: ['offline', Validators.required],
    paymentMethod: ['', Validators.required],
    txnId: ['', Validators.required],
    txnDate: ['', Validators.required],
    paymentStatus: ['', Validators.required],
  });

  cancelProducts: boolean;
  productsEligibleForCancel: any[] = [];

  packageSlipDetails: any;
  currentOpenedAttachment:any;
  currentOpenedAttachmentType:any;
  showImageBlock:boolean=true;
  imageUrl = environment.imageUrl;
  openModalRef: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: EcommerceService,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [
          { label: "Ecommerce" },
          { label: "Order Details", active: true },
        ];
        this.orderId = this.route.snapshot.params.id;
        this.getOrderDetail();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        if (this.route.snapshot.queryParams['showPaymentLink'] == 'true')
          this.openLinkModal(this.paymentLinkModal);
    });
  }

  getOrderDetail() {
    this.spinner.show();
    this.apiService.getOrderDetails(this.orderId).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            setTimeout(() => {
              this.orderDetails = res.data;
              this.products = res.data.products;
              this.shipments = res.data.shippingDetails;
              this.cdr.detectChanges();
            });
          }
        }, 
        error: (err: any) => {
          this.spinner.hide();
          console.error(err);
        }
    });
  }

  onShowPaymentForm() {
    this.showTxnInfoForm = true;
    let txnDate = '';
    if (this.orderDetails.paymentDetails?.txnDate) {
      txnDate = getFormatedDate(this.orderDetails.paymentDetails?.txnDate, 'YYYY-MM-DD')
    }
    this.paymentFormGroup.patchValue({
      paymentType: 'offline',
      paymentMethod: this.orderDetails.paymentMethod || '',
      paymentStatus: this.orderDetails.paymentStatus || '',
      txnId: this.orderDetails.paymentDetails?.txnId || '',
      txnDate: txnDate,
    });
    setTimeout(() => {
        this.cdr.detectChanges();
    });
  }

  navigateToUser(user) {
    this.router.navigate([`contacts/list/edit/${user._id}`]);
  }

  onChangePayType() {
    let { paymentMethod } = this.paymentFormGroup.value;
    paymentMethod == 'cod' ? this.paymentFormGroup.get('txnId').disable() : this.paymentFormGroup.get('txnId').enable();
    setTimeout(() => {
        this.cdr.detectChanges();
    });
  }

  onSubmitTxnInfo() {
    let { value } = this.paymentFormGroup
    const data = {
      _id: this.orderDetails._id,
      ...value
    }
    if (data.paymentMethod == 'cod') data.txnId = '';

    this.spinner.show();
    this.apiService.updatePaymentStatus(data as any).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.success) {
            setTimeout(() => {
                this.toastr.success('Payment details updated')
                this.showTxnInfoForm = false;
                this.paymentFormGroup.reset();
                this.orderDetails.paymentType = value.paymentType;
                this.orderDetails.paymentMethod = value.paymentMethod;
                this.orderDetails.paymentStatus = value.paymentStatus;
        
                if (!this.orderDetails.paymentDetails) this.orderDetails.paymentDetails = {};
                this.orderDetails.paymentDetails.txnId = value.txnId;
                this.orderDetails.paymentDetails.txnDate = value.txnDate;
                this.cdr.detectChanges();
            });
          } else {
            this.toastr.error('Something went wrong');
          }
        }, 
        error: (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error('Something went wrong');
        }
    });


  }
  openLinkModal(elemRef) {
    this.modalService.open(elemRef, { size: 'lg', windowClass: 'modal-holder', centered: true })
  }

  getPackageSlipData(waybill) {
    this.spinner.show()
    this.apiService.createPackagingSlip(waybill).subscribe({
        next: (res: any) => {
          const { success, data } = res;
          if (success && data.packages_found) {
            this.packageSlipDetails = data.packages[0]
            setTimeout(() => {
              this.printPackageSlip();
              this.spinner.hide();
              this.cdr.detectChanges();
            }, 1500);
          } else {
            this.spinner.hide();
          }
        }, 
        error: err => {
          this.spinner.hide()
        }
    });
  }

  printPackageSlip() {
    var frameName = 'slipPrintIframe';
    var doc = window.frames[frameName];
    if (!doc) {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.setAttribute('name', frameName);
      document.body.append(iframe)
      doc = window.frames[frameName];
    }
    doc.document.title = 'Delhivery | Order ID: ' + this.orderDetails.orderId;
    doc.document.body.innerHTML = document.querySelector('#delhiveryPackageSlip').innerHTML;
    doc.window.print();
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.toastr.success('Link copied!')
  }

  showCancelProducts() {
    this.productsEligibleForCancel = this.products.filter(el => ['processing', 'hold', 'placed'].includes(el.statusDetails));
    if (this.productsEligibleForCancel.length) this.cancelProducts = true;
    setTimeout(() => {
        this.cdr.detectChanges();
    });
  }

  hideCancelProducts() {
    this.cancelProducts = false;
    setTimeout(() => {
        this.cdr.detectChanges();
    });
  }

  qtyArray(qty) {
    return new Array(qty).fill('').map((_, i) => i + 1);
  }

  submitCancelProducts(form: NgForm): void {
    console.log(form);
    let { reason, comment, ...qty } = form.value;
    let quantity = [];
    for (let key in qty) {
      quantity.push(qty[key])
    }

    let products = quantity.map((value, i) => {
      return {
        productId: this.productsEligibleForCancel[i].productId._id,
        quantity: parseInt(value || 0)
      };
    }).filter(el => el.quantity);

    let data = {
      _id: this.orderDetails._id,
      products,
      reason,
      comment
    }
    if(!products.length) { this.toastr.error('Please select some products to generate invoice'); return; }
    this.spinner.show();
    this.apiService.cancelOrderProducts(data).subscribe({
        next: (res: any) => {
          setTimeout(() => {
              this.toastr.success('Product(s) canceled successfully');
              this.hideCancelProducts();
              this.getOrderDetail();
              this.cdr.detectChanges();
          });
        }, 
        error: error => {
          this.spinner.hide();
          this.toastr.error('Something went wrong');
        }
    });
  }

  viewUploadedPrescription(item){

    let {prescriptionUploadedForProduct} = item;

    this.currentOpenedAttachment = prescriptionUploadedForProduct.prescriptionImage[0].savedName;

    let fileType: any;
    fileType = this.currentOpenedAttachment.split(".");
    this.currentOpenedAttachmentType = fileType[1];
    if (
      this.currentOpenedAttachmentType == "pdf" ||
      this.currentOpenedAttachmentType == "PDF" ||
      this.currentOpenedAttachmentType == "Pdf"
    ) {
      this.showImageBlock = false;
      this.currentOpenedAttachment =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          this.imageUrl + this.currentOpenedAttachment+ '#toolbar=0'
        );
    } else {
      this.showImageBlock = true;
    }
    this.openModalRef = this.modalService.open(this.medicalAttachmentModal, {
      size: "xl",
      windowClass: "modal-holder",
      centered: true,
    });
    window.scroll(0, 0);
    setTimeout(() => {
        this.cdr.detectChanges();
    });
  }

}
