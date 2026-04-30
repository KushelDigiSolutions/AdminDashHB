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
import { TransactionService } from '../../orders/transaction.service';
import { Transaction } from '../../orders/transaction';
import { NgbdSortableHeader, SortEvent } from '../../sortable-directive';
import { AddVariationComponent } from '../../modals/add-variation/add-variation.component';
import { Observable, of } from 'rxjs';
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
  selector: "app-variations",
  templateUrl: "./variations.component.html",
  styleUrls: ["./variations.component.scss"],
  providers: [TransactionService, DecimalPipe],
})
export class VariationsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  attributeName: any;
  dataArray = [];

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    public service: TransactionService,
    private apiService: EcommerceService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [
          { label: "Ecommerce" },
          { label: "Variations", active: true },
        ];
        this.getVariations();
    });
  }

  getVariations() {
    this.apiService.getVariations().subscribe({
        next: (res: any) => {
            setTimeout(() => {
                if (res.data) {
                    this.dataArray = res.data;
                    this.total$ = of(this.dataArray.length);
                } else {
                    this.dataArray = [];
                }
                this.cdr.detectChanges();
            });
        },
        error: (err: any) => {
            this.toaster.error(err.error?.message || 'Error fetching variations');
        }
    });
  }

  openVariationAddmodal(data='') {
    const modalRef = this.modalService
      .open(AddVariationComponent, { size: "lg" });
      
      modalRef.componentInstance.data = data;
      
      modalRef.result.then(
        (result) => {
          if (result == true) {
            this.getVariations();
          }
        },
        (reason) => {
          console.log("reason", reason);
        }
      );
  }

  deleteVariation(id) {
    this.apiService.deleteVariation(id).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                this.toaster.success("Variation removed Successfully");
                this.getVariations();
                this.cdr.detectChanges();
            });
        },
        error: (err: any) => {
            this.toaster.error(err.error?.message || 'Error deleting variation');
        }
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    // this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
