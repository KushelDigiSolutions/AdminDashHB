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
import { UIModule } from '../../../../../shared/ui/ui.module';
import { EcommerceService } from '../../../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
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
  selector: "app-refund-modal",
  templateUrl: "./refund-modal.component.html",
  styleUrls: ["./refund-modal.component.scss"],
})
export class RefundModalComponent implements OnInit {

  @Input()
  set data(data: any) {
    if (data && data.currentStatus != 'cancelled') {
      this.isPartialRefund = true;
      this.getRefundableAmount(data._id);
    } else {
      this.refundableAmount = data.totalPayableAmount;
    }
    this.orderData = data;
    console.log('[RefundModalComponent]', data);

  }

  get data(): any {
    return this.orderData;
  }

  orderData: any;
  refundableAmount: number;
  isPartialRefund = false;
  form: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private activatedModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apiService: EcommerceService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      orderId: [this.data._id ? this.data._id : '', [Validators.required]],
      refundAmount: ["", [Validators.required, Validators.max(this.data.totalPayableAmount)]],
    });
  }

  refund() {
    if (this.form.valid) {
      this.spinner.show();
      const { value } = this.form;
      if (this.isPartialRefund) {
        value.productIds = this.orderData.products.map(product => product.cancelledProduct ? product.productId._id : '').filter(_id => Boolean(_id));
      }

      this.apiService.refundOrder(this.form.value)
        .subscribe((res) => {
          this.spinner.hide();
          const { success } = res;
          if (success) {
            this.toaster.success("Refund Initiated");
            this.activatedModal.close('success');
          } else {
            this.toaster.error('Try again later', 'Something went wrong!');
          }
        },
          err => {
            this.spinner.hide();
            this.toaster.error(err.error.error);
          });

    } else {
      if (this.form.get('refundAmount').value > this.data.totalPayableAmount) {
        this.toaster.error("Please enter valid amount to be refunded");
      } else {
        this.toaster.error("Please enter an amount to refund");
      }
    }
  }

  getRefundableAmount(_id) {
    this.spinner.show();
    this.apiService.getRefundableAmount(_id).subscribe((res: any) => {
      this.spinner.hide();
      if (res.success) {
        this.refundableAmount = res.totalRefundAmount;
        this.form.get('refundAmount').setValidators([Validators.required, Validators.max(this.refundableAmount)])

      };
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();

    });
  }

  cancel() {
    this.activatedModal.close('fail');
  }
}
