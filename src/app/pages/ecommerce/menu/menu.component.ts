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
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [TransactionService, DecimalPipe]
})
export class MenuComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  menu = [];
  list: any[] = [];
  dataArray: any[] = [];
  pageSize = 10;
  page = 1;
  count = 0;

  constructor(
    public service: TransactionService,
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Menu', active: true }];
        this.getList();
    });
  }

  getList() {
    this.apiService.getMenuList().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if (res.data && res.data.menus) {
            this.menu = JSON.parse(JSON.stringify(res.data.menus));
          } else {
            this.menu = [];
          }
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.log("err", err);
      }
    });
  }

  onDelete(item: any, list: any[]) {
    if (confirm("Are you sure you want to delete \"" + item.name + "\"?")) {
      let id = item._id;
      this.spinner.show();
      this.apiService.deleteMenu(id).subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.spinner.hide();
            list.splice(list.indexOf(item), 1);
            this.toastr.success('Menu link removed successfully');
            this.cdr.detectChanges();
          });
        },
        error: (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error(err.error?.message || 'Something went wrong!');
        }
      });
    }
  }
}
