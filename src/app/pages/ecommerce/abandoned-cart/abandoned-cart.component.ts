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
import { TransactionService } from '../orders/transaction.service';
import { Transaction } from '../orders/transaction';
import { NgbdSortableHeader, SortEvent } from '../sortable-directive';
import { getFormatedDate } from '../../../util/date.util';
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
    NgbModalModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: "app-abandoned-cart",
  templateUrl: "./abandoned-cart.component.html",
  styleUrls: ["./abandoned-cart.component.scss"],
  providers: [TransactionService, DecimalPipe],
})
export class AbandonedCartComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  carts = [];
  count = 0;
  page: number;
  pageSize: number;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public service: TransactionService,
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [
          { label: "Ecommerce" },
          { label: "Carts", active: true },
        ];

        this.route.queryParams.subscribe((res: any) => {
          setTimeout(() => {
            this.pageSize = res.limit ? parseInt(res.limit) : 10;
            this.page = res.page ? parseInt(res.page) : 1;
            this.getAbandonedCartList();
          });
        });
    });
  }

  getAbandonedCartList() {
    let params = { limit: this.pageSize, page: this.page };
    this.spinner.show();
    this.apiService.getAbandonedCartList(params).subscribe({
        next: (res: any) => {
            this.spinner.hide();
            const { success, data, total } = res;
            if (success && data) {
                setTimeout(() => {
                    this.count = total;
                    this.carts = data.map(cart => {
                        cart.fullName = cart.userId ? this.getFullName(cart.userId) : 'Guest User';
                        let qty = 0;
                        cart.products.forEach(el => qty += el.quantity);
                        cart.totalQty = qty;
                        return cart;
                    });
                    this.cdr.detectChanges();
                });
            } else {
                setTimeout(() => {
                    this.count = 0;
                    this.carts = [];
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

  getFullName(data) {
    return ((data.firstName || '') + ' ' + (data.lastName || '')).trim();
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
    this.getAbandonedCartList();
  }

  changeValue(event: any, type: string) {
    if (type == "page") this.page = event;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) header.direction = "";
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
    this.cdr.detectChanges();
  }
}
