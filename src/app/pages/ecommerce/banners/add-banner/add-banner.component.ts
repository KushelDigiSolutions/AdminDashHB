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
    NgbModalModule
  , HbSwitchComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent implements OnInit {

  bannerTypes = [
    { value: 'home', title: 'Home Banner' },
    { value: 'lifestyle', title: 'Lifestyle Tips' },
    { value: 'consultUs', title: 'Consult Us' },
    { value: 'diagnostic', title: 'Diagnostic' },
    { value: 'healthPackage', title: 'Health Package' },
  ];
  form: FormGroup;
  editId: any;
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
      title: [""],
      description: [""],
      type: ["", [Validators.required]],
      link: "",
      image: [[], [Validators.required]],
      mobImage: [[], [Validators.required]],
      buttonText: "",
      active: [true],
      couponCode: [""],
    });
  }

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) this.fetchBanner();
  }

  fetchBanner() {
    this.spinner.show();
    this.api.getBannerDetail(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      const { data } = res;
      this.form.patchValue({
        title: data.title,
        description: data.description,
        type: data.type,
        link: data.link,
        image: data.image && typeof data.image == 'object' ? [data.image] : [],
        mobImage: data.mobImage && typeof data.mobImage == 'object' ? [data.mobImage] : [],
        buttonText: data.buttonText,
        active: data.active,
        couponCode: data.couponCode
      });
    }, () => this.spinner.hide());
  }

  trim(input: any) {
    if (input instanceof AbstractControl) input.setValue(input.value.trim());
    else if (input.control) input.control.setValue(input.value.trim());
  }

  onSubmit() {
    const value: any = { ...this.form.value };
    this.spinner.show();
    forkJoin([
      this.fileUploadService.smartFileUpload(value.image),
      this.fileUploadService.smartFileUpload(value.mobImage)
    ]).subscribe((resArr: any) => {
      const [imageRes, mobImageRes] = resArr;
      value.image = imageRes.data[0];
      value.mobImage = mobImageRes.data[0];
      if (this.editId) value._id = this.editId;
      (this.editId ? this.api.updateBanner(value) : this.api.addBanner(value)).subscribe((res: any) => {
        this.spinner.hide();
        this.toaster.success(res.message);
        this.router.navigateByUrl('/ecommerce/banners');
      }, () => this.spinner.hide());
    }, (err) => {
      this.spinner.hide();
      this.toaster.error('Problem uploading images');
    });
  }
}
