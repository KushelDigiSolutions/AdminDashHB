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
import { RemoveModalComponent } from '../../modals/remove/remove-modal/remove-modal.component';

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
  selector: 'app-international-enquiry-list',
  templateUrl: './international-enquiry-list.component.html',
  styleUrls: ['./international-enquiry-list.component.scss']
})
export class InternationalEnquiryListComponent implements OnInit {
  enquiries: any[] = [];
  enquiriesData: any = { count: 0 };
  page = 1;
  pageSize = 10;

  constructor(
    private api: EcommerceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((qp: any) => {
      setTimeout(() => {
        this.pageSize = qp.limit ? parseInt(qp.limit, 10) : 10;
        this.page = qp.page ? parseInt(qp.page, 10) : 1;
        this.getEnquiryList();
      });
    });
  }

  getEnquiryList() {
    const params: any = { limit: this.pageSize, page: this.page };
    this.spinner.show();
    this.api.getIntEnquiryList(params)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res && res.success) {
            setTimeout(() => {
              const all = res.data || [];
              this.enquiries = Array.isArray(all) ? all : [];
              this.enquiriesData.count = res.pagination?.total ?? (Array.isArray(all) ? all.length : 0);
              if (res.pagination) {
                this.page = res.pagination.page || this.page;
                this.pageSize = res.pagination.limit || this.pageSize;
              }
              this.cdr.detectChanges();
            });
          } else {
            setTimeout(() => {
              this.enquiries = [];
              this.enquiriesData.count = 0;
              this.cdr.detectChanges();
            });
          }
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err?.error?.message || 'Failed to load enquiries');
        }
      });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.page, limit: this.pageSize } });
    this.getEnquiryList();
  }

  deleteEnquiry(enquiry: any) {
    const id = enquiry.enquiryId;
    const data = { value: 'Enquiry' };

    const modalRef = this.modal.open(RemoveModalComponent, { size: 'lg' });
    modalRef.componentInstance.data = data;

    modalRef.result.then(
      (result) => {
        if (result === 'yes') {
          this.spinner.show();
          this.api.deleteIntEnquiryById(id).subscribe({
            next: (res: any) => {
              setTimeout(() => {
                this.spinner.hide();
                this.toastr.success('Enquiry removed Successfully');
                this.getEnquiryList();
                this.cdr.detectChanges();
              });
            },
            error: (err: any) => {
              this.spinner.hide();
              this.toastr.error(err?.error?.message || 'Failed to delete enquiry');
            }
          });
        }
      },
      (reason) => {
        // modal dismissed
      }
    ).catch(() => { });
  }

}
