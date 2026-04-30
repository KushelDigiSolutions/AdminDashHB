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
  selector: 'app-enquiry-detail',
  templateUrl: './enquiry-detail.component.html',
  styleUrls: ['./enquiry-detail.component.scss']
})
export class EnquiryDetailComponent implements OnInit {

  enquiry: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: EcommerceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
        this.route.params.subscribe(params => {
          setTimeout(() => {
            const id = params['id'];
            if (id) this.loadEnquiry(id);
          });
        });
    });
  }

  loadEnquiry(id: string) {
    const params: any = { enquiryId: id };
    this.spinner.show();
    this.api.getDetailsByEnquiryId(params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res && res.success) {
          setTimeout(() => {
            const data = Array.isArray(res.data) ? res.data[0] : res.data;
            this.enquiry = data || null;
            this.cdr.detectChanges();
          });
        } else {
          setTimeout(() => {
            this.enquiry = null;
            this.toastr.error('Unable to fetch enquiry details');
            this.cdr.detectChanges();
          });
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to load enquiry details');
      }
    });
  }

  back() {
    this.router.navigate(['/ecommerce/orders/enquiries']);
  }

}
