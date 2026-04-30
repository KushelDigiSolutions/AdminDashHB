import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgModel, NgForm, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule, NgbDatepickerModule, NgbModalModule, NgbModal, NgbActiveModal, NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../../shared/ui/ui.module';
import { EcommerceService } from '../../ecommerce.service';
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
    NgbAccordionModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    UIModule,
    NgSelectModule,
    DropzoneModule,
    NgbModalModule, HbSwitchComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-products-reviews',
  templateUrl: './products-reviews.component.html',
  styleUrls: ['./products-reviews.component.scss']
})
export class ProductsReviewsComponent implements OnInit {

  breadCrumbItems = [
    { label: "Products" },
    { label: "Reviews", active: true },
  ];
  list = [];
  total = 0;
  page = 1;
  limit = 10;

  constructor(
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any) => {
      setTimeout(() => {
        this.limit = res.limit ? parseInt(res.limit) : 10;
        this.page = res.page ? parseInt(res.page) : 1;
        this.getList();
      });
    });
  }

  getList() {
    let params = {
      limit: this.limit,
      page: this.page
    }
    this.apiService.getProductsReviews(params).subscribe({
        next: (res: any) => {
          let { status, data, count } = res;
          if (status) {
            setTimeout(() => {
              this.list = data;
              this.total = count;
              this.cdr.detectChanges();
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
    });
  }

  toggleFxn(data, type: 'verified' | 'publish') {
    return new Observable((observer) => {

      if (type == "verified") {
        data.toggleVerifiedLoading = true;
      } else if (type == "publish") {
        data.togglePublishLoading = true;
      }

      let req = this.apiService.verifyReview(data._id, !data.verified)
      if (type == "publish") {
        req = this.apiService.publishReview(data._id, !data.publish)
      }

      req.subscribe({
        next: (res) => {
            setTimeout(() => {
                if (type == "verified") {
                    data.verified = !data.verified;
                    data.toggleVerifiedLoading = false;
                } else if (type == "publish") {
                    data.publish = !data.publish;
                    data.togglePublishLoading = false;
                }
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: HttpErrorResponse) => {
            setTimeout(() => {
                if (type == "verified") {
                    data.toggleVerifiedLoading = false;
                } else if (type == "publish") {
                    data.togglePublishLoading = false;
                }
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });
  }

  pageChanged() {
    this.router.navigate([], {
      queryParams: { limit: this.limit, page: this.page },
      relativeTo: this.route,
    });
    this.getList();
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.pageChanged();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
