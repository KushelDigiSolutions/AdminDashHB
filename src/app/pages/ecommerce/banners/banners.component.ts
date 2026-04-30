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
  , HbSwitchComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  imgUrl = environment.imageUrl;
  dataArray = [];
  count = 10;
  page = 1;
  pageSize = 10;
  constructor(
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Banners', active: true }];
        this.getBannersList();
    });
  }

  getBannersList() {
    this.spinner.show();
    this.apiService.getBannerList().subscribe({
        next: (res: any) => {
            this.spinner.hide();
            if (res.data && res.data.banners) {
                setTimeout(() => {
                    this.dataArray = res.data.banners;
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

  toggleFxn(data) {
    return new Observable((observer) => {
      data.toggleActiveLoading = true;
      let body = {
        active: !data.active,
        _id: data._id
      }
      this.apiService.updateBanner(body).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                data.toggleActiveLoading = false;
                data.active = !data.active;
                this.cdr.detectChanges();
                observer.next(true);
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                data.toggleActiveLoading = false;
                this.cdr.detectChanges();
                observer.next(false);
            });
        }
      });
    });
  }

  changeValue(event, type) {

  }

  removeBanner(data) {
    if (confirm('Are you sure you want to delete "' + data.title + '" banner?')) {
      this.spinner.show();
      this.apiService.removeBanner(data._id)
        .subscribe({
            next: (res: any) => {
              this.toaster.success(res.message);
              this.getBannersList();
            }, 
            error: (err: HttpErrorResponse) => {
              this.spinner.hide();
              this.toaster.error(err.error?.message || 'Something went wrong!');
            }
        });
    }

  }

}
