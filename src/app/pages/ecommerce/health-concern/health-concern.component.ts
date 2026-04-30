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
  selector: 'app-health-concern',
  templateUrl: './health-concern.component.html',
  styleUrls: ['./health-concern.component.scss']
})
export class HealthConcernComponent implements OnInit {


  breadCrumbItems: Array<{}> = [];
  tempPageSize: any;
  tempsearchTerm: any;
  pageSize = 10;
  page = 1;

  dataArray = [];
  count: number;
  imgUrl = environment.imageUrl;
  childId;


  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Category', active: true }];


        this.childId = this.route.snapshot.params.id;
        if (this.childId) {
          this.fetchHealthConcern();
        } else {
          this.getHealthConcern();
        }
    });
  }

  getHealthConcern() {
    const url = `?limit=${this.pageSize}&page=${this.page}`;
    this.spinner.show();
    this.apiService.getHealthConcernList(url)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data && res.data.healthConcerns) {
            setTimeout(() => {
              this.dataArray = res.data.healthConcerns;
              this.count = res.data.count;
              this.cdr.detectChanges();
            });
          }
        },
        error: (err: any) => {
          this.spinner.hide();
          console.log("err", err);
        }
      });
  }

  fetchHealthConcern() {
    let url = `/detail?products=false&filter=false&_id=${this.childId}`;
    this.spinner.show();
    this.apiService.getHealthConcernList(url)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
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
          this.spinner.hide();
        }
      });
  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    }
    this.getHealthConcern();
  }

  removeHealthConcern(id) {
    this.apiService.removeHealthConcern(id)
      .subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.toastr.success(res.message);
            if (this.childId) {
                this.fetchHealthConcern();
            } else {
                this.getHealthConcern();
            }
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => { }
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
      this.apiService.toggleHealthConcernTop(body).subscribe({
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
      this.apiService.toggleHealthConcernFeatured(body).subscribe({
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

  toggleStatus(data) {
    return new Observable((observer) => {
      data.toggleStatusLoading = true;
      let body = {
        active: !data.active,
        _id: data._id
      };
      this.apiService.updateHealthConcern(body).subscribe({
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
  toggleVisibilityHome(data) {
    return new Observable((observer) => {
      data.toggleVisibleAtHome = true;
      let body = {
        visibleAtHome: !data.visibleAtHome,
        _id: data._id
      };
      this.apiService.updateHealthConcern(body).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                data.toggleVisibleAtHome = false;
                data.visibleAtHome = !data.visibleAtHome;
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                data.toggleVisibleAtHome = false;
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });

  }
  toggleVisibilityLifeStyle(data) {
    return new Observable((observer) => {
      data.toggleVisibleAtLifeStyle = true;
      let body = {
        visibleAtLifeStyle: !data.visibleAtLifeStyle,
        _id: data._id
      };
      this.apiService.updateHealthConcern(body).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                data.toggleVisibleAtLifeStyle = false;
                data.visibleAtLifeStyle = !data.visibleAtLifeStyle;
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                data.toggleVisibleAtLifeStyle = false;
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });

  }
  toggleVisibilityConsultUs(data) {
    return new Observable((observer) => {
      data.toggleVisibleAtConsultUs = true;
      let body = {
        visibleAtConsultUs: !data.visibleAtConsultUs,
        _id: data._id
      };
      this.apiService.updateHealthConcern(body).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                data.toggleVisibleAtConsultUs = false;
                data.visibleAtConsultUs = !data.visibleAtConsultUs;
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                data.toggleVisibleAtConsultUs = false;
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });

  }
}
