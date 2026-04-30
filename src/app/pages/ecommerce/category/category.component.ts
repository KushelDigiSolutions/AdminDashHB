import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';
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
import { environment } from '../../../../environments/environment';
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
    NgbModalModule,
    NgbdSortableHeader,
    HbSwitchComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  breadCrumbItems: Array<{}>; 
  tempPageSize: any;
  tempsearchTerm: any;
  pageSize = 10;
  page = 1;
  search: string = '';

  dataArray = [];
  total = 0;
  imgUrl = environment.imageUrl;

  childId;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private apiService: EcommerceService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Category', active: true }];

        this.childId = this.route.snapshot.params.id;
        if (this.childId) {
          this.fetchCategory();
        } else {
          this.getCategoryList();
        }
    });
  }

  getCategoryList() {
    const url = `?limit=${this.pageSize}&page=${this.page}`;
    this.apiService.getCategoryList(url)
      .subscribe({
        next: (res: any) => {
          if (res.data && res.data.categories) {
            setTimeout(() => {
              this.dataArray = res.data.categories;
              this.total = res.data.count;
              this.cdr.detectChanges();
            });
          }
        },
        error: (err: any) => {
          console.log("err", err);
        }
      });
  }

  fetchCategory() {
    let url = `/detail?_id=${this.childId}`;

    this.apiService.getCategoryList(url)
      .subscribe({
        next: (res: any) => {
          setTimeout(() => {
            if (res.data && res.data.children) {
                this.dataArray = res.data.children;
            } else {
                this.dataArray = [];
            }
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          console.log("err", err);
        }
      });
  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    }
    this.getCategoryList();
  }

  removeCategory(category) {
    if (!confirm('Are you sure you want to delete "' + category.name + '" category?')) return;
    this.apiService.removeCategory(category._id)
      .subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.toaster.success(res.message);
            if (this.childId) {
                this.fetchCategory();
            } else {
                this.getCategoryList();
            }
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          console.log("err", err);
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

  toggleTop(data) {
    return new Observable((observer) => {
      data.toggleTopLoading = true;
      let body = {
        isTop: !data.isTop,
        _id: data._id
      };
      this.apiService.toggleCategoryTop(body).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                data.toggleTopLoading = false;
                data.isTop = !data.isTop;
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                data.toggleTopLoading = false;
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });
  }

  toggleFeatured(data) {
    return new Observable((observer) => {
      data.toggleFeaturedLoading = true;
      let body = {
        isFeatured: !data.isFeatured,
        _id: data._id
      };
      this.apiService.toggleCategoryFeatured(body).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                data.toggleFeaturedLoading = false;
                data.isFeatured = !data.isFeatured;
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                data.toggleFeaturedLoading = false;
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });
  }

  navigateToCategory(data) {
    this.router.navigate(['ecommerce/add-category'], { state: { data: data } });
  }

}
