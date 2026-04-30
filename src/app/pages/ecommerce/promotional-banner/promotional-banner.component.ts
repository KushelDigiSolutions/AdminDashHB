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
import { AuthenticationService } from '../../../core/services/auth.service';
import { LifestyleService } from '../../lifestyle/lifestyle.service';
import { User } from '../../../core/models/auth.models';
import { RequestHttpParams } from '../../../core/services/api.service';
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
  selector: "app-promotional-banner",
    templateUrl: "./promotional-banner.component.html",
    styleUrls: ['./promotional-banner.component.scss']
})
export class PromotionalBannerComponent implements OnInit {
    user: User;
    search: string = '';
    path: string;
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
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private lifestyleService: LifestyleService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        setTimeout(() => {
            let urlSegments = this.route.snapshot.url;
            this.path = urlSegments[urlSegments.length - 1].path;
            this.user = this.authService.currentUser()

            this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Promotional Banners', active: true }];
            this.getPromotionalBannerList();
        });
    }

    getPromotionalBannerList() {

        let params: RequestHttpParams = {
            limit: this.pageSize,
            page: this.page
        };

        this.apiService.getPromotionalBannerList(params).subscribe({
            next: (res: any) => {
                if (res.data && res.data.banners) {
                    setTimeout(() => {
                        this.dataArray = res.data.banners;
                        this.count = res.data.count;
                        this.cdr.detectChanges();
                    });
                }
            },
            error: (err: any) => {
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
            this.apiService.updatePromotionalBanner(body).subscribe({
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
        })
    }

    changeValue(event, type) {
        if (type == "page") {
            this.page = event;
        }
        this.getPromotionalBannerList();
    }

    removePromotionalBanner(data) {

        if (confirm('Are you sure you want to delete "' + data.type + '" promotional banner?')) {
            this.spinner.show();
            this.apiService.removePromotionalBanner(data._id)
                .subscribe({
                    next: (res: any) => {
                        this.toaster.success(res.message);
                        this.getPromotionalBannerList();
                    },
                    error: (err: HttpErrorResponse) => {
                        this.spinner.hide();
                        this.toaster.error(err.error?.message || 'Something went wrong!');
                    }
                });
        }

    }

}