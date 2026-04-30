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
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../../shared/ui/ui.module';
import { EcommerceService } from '../../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { FileUploadService, FileUploadResponse } from '../../../../core/services/file-upload.service';
import { Observable, forkJoin } from 'rxjs';
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
  selector: 'add-promotional-banner',
    templateUrl: './add-promotional-banner.component.html',
    styleUrls: ['./add-promotional-banner.component.scss']
})

export class AddPromotionalBannerComponent implements OnInit {

    bannerTypes = [
        { value: 'shop-now', title: 'Shop Now' },
        { value: 'consult-us', title: 'Consult Us' },
        { value: 'lifestyle-tip', title: 'Lifestyle Tip' },
        { value: 'health-package', title: 'Health Package' },
    ];
    cardTypes = [
        { value: 'normal', title: 'Normal' },
        { value: 'coupon', title: 'Coupon' },
    ];
    form: FormGroup;
    editId;
    s3Base = environment.imageUrl;

    constructor(
        private formBuilder: FormBuilder,
        private api: EcommerceService,
        private router: Router,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private toaster: ToastrService,
        private fileUploadService: FileUploadService,
    ) {

        this.form = this.formBuilder.group({
            type: ["", [Validators.required]],
            link: ["", []],
            altText: ["", [Validators.required]],
            cardType: ["", [Validators.required]],
            image: [[], [Validators.required]],
            mobImage: [[]],
            active: [true],
            couponCode: [''],
        });

        this.editId = this.route.snapshot.params.id;
        if (this.editId) {
            this.fetchPromotionalBanner();
        }
    }

    ngOnInit(): void {
    }

    fetchPromotionalBanner() {
        this.spinner.show();
        this.api.getPromotionalBannerDetail(this.editId)
            .subscribe((res: any) => {
                this.spinner.hide();
                let { data } = res;
                this.form.patchValue({
                    type: data.type,
                    link: data.link,
                    altText: data.altText,
                    cardType: data.cardType,
                    image: data.image && typeof data.image == 'object' ? [data.image] : [],
                    mobImage: data.mobImage && typeof data.mobImage == 'object' ? [data.mobImage] : [],
                    active: data.active,
                    couponCode: data.couponCode,
                })
            }, (err: any) => {
                this.spinner.hide();
                this.router.navigateByUrl('/ecommerce/promotional-banners');
            });
    }

    trim(input: NgModel | AbstractControl) {
        if (input instanceof AbstractControl) {
            input.setValue(input.value.trim());
        } else {
            input.control.setValue(input.value.trim());
        }
    }

    onSubmit() {
        let value = { ...this.form.value };
        let { image, mobImage } = value;
        forkJoin<Observable<FileUploadResponse>[]>([
            // this.fileUploadService.smartFileUpload(image, 'banner'),
            this.fileUploadService.smartFileUpload(image),
            this.fileUploadService.smartFileUpload(mobImage)
        ]).subscribe((resArr: any) => {

            let [imageRes, mobImageRes] = resArr;
            value.image = imageRes.data[0];
            value.mobImage = mobImageRes.data[0] ? mobImageRes.data[0] : null

            if (this.editId) {
                value._id = this.editId
            }

            (this.editId ? this.api.updatePromotionalBanner(value) : this.api.addPromotionalBanner(value))
                .subscribe((res: any) => {
                    this.spinner.hide();
                    this.router.navigateByUrl('/ecommerce/promotional-banners');
                    this.toaster.success(res.message);
                }, (err: any) => {
                    this.spinner.hide();
                    this.toaster.error(err.error?.message || 'Something went wrong!');
                })
        }, (err: HttpErrorResponse) => {
            this.toaster.error(err?.error?.message || 'Issue in file uploading!')
        })
    }
}