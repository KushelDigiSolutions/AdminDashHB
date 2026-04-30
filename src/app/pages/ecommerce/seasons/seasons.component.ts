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
    NgbdSortableHeader
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss'],
  providers: [TransactionService, DecimalPipe]
})
export class SeasonsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  list: any[] = [];
  dataArray: any[] = [];
  pageSize = 10;
  page = 1;
  count = 0;

  constructor(
    public service: TransactionService,
    private apiService: EcommerceService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Seasons', active: true }];
        this.getList();
    });
  }

  getList() {
    this.apiService.getSeasonList().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.list = res.data;
          this.count = this.list.length;
          this.changeValue(null, '');
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

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  removeSeason(id) {
    this.apiService.removeSeason(id).subscribe({
      next: (res: any) => {
        setTimeout(() => {
            this.toaster.success(res.message);
            this.getList();
            this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        this.toaster.error(err.error?.message || "Something went wrong");
      }
    });
  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    }
    this.dataArray = this.list.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    this.cdr.detectChanges();
  }
}
