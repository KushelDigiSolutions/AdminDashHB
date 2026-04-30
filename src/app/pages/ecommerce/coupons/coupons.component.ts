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
import { NgbdSortableHeader, SortEvent } from '../sortable-directive';
import { Observable } from 'rxjs';

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
    NgbHighlight,
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
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  couponList = [];
  pageSize = 10;
  page = 1;

  tempPageSize;
  tempsearchTerm;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private apiService: EcommerceService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Coupons', active: true }];
        this.getCoupons();
    });
  }

  getCoupons() {
    this.apiService.getCoupons().subscribe({
        next: (res: any) => {
            setTimeout(() => {
                this.couponList = res.data;
                this.cdr.detectChanges();
            });
        },
        error: (err: any) => {
            console.error(err);
        }
    });
  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    }
    // this.getCoupons();
    window.scroll(0, 0)
  }

  toggleStatus(data) {
    return new Observable((observer) => {
      data.toggleStatusLoading = true;
      let body = {
        active: !data.active,
        _id: data._id
      }
      this.apiService.updateCoupon(body).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                data.toggleStatusLoading = false;
                data.active = !data.active;
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                data.toggleStatusLoading = false;
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });

  }


  removeCoupon(id) {
    this.apiService.removeCoupon(id).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                this.toaster.success(res.message);
                this.getCoupons();
                this.cdr.detectChanges();
            });
        },
        error: (err: any) => {
            this.toaster.error(err.error?.message || 'Error removing coupon');
        }
    });
  }


  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

  }


}
