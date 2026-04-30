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
import { Observable, of, firstValueFrom } from 'rxjs';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {
  form: FormGroup;
  public Editor = ClassicEditor;
  editId: any;
  oldFiles = [];
  files = [];
  types = [];
  s3Base = environment.imageUrl;

  tempSwitchData = {
    metaIndex: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      logo: [[], [Validators.required]],
      name: ["", [Validators.required]],
      margin: [""],
      description: [""],
      metaTitle: [""],
      metaDescription: [""],
      type: "",
      metaIndex: [false]
    })
  }

  ngOnInit() {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) this.fetchBrand();
    this.getTypesList();
  }

  getTypesList() {
    firstValueFrom(this.apiService.getTypes()).then((res: any) => {
      if (res.data) this.types = res.data;
    });
  }

  fetchBrand() {
    this.spinner.show();
    this.apiService.getBrand(this.editId).subscribe(res => {
      this.spinner.hide();
      let { data } = res;
      this.oldFiles = typeof data.logo == 'object' ? [data.logo] : [];
      this.form.patchValue({
        logo: this.oldFiles[0]?.savedName || '',
        name: data.name,
        margin: data.margin,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        type: data.type?._id || '',
        metaIndex: data.metaIndex
      })
    }, () => this.spinner.hide());
  }

  typeSelected() {
  }

  onSelect(event: any) {
    let file = event.addedFiles[0];
    if (file) {
      this.oldFiles = [];
      this.files = [file];
      this.form.patchValue({ logo: this.files });
    }
  }

  onRemove(i: number) {
    this.files.splice(i, 1);
    this.form.patchValue({ logo: this.files });
  }

  trim(input: any) {
    if (input instanceof AbstractControl) input.setValue(input.value.trim());
    else if (input.control) input.control.setValue(input.value.trim());
  }

  addbrand() {
    if (this.form.invalid) {
      this.toaster.error('Please fillout all required fields');
      return;
    }
    let value: any = { ...this.form.value };
    let { logo } = value;
    let uploadReq: Observable<any>;
    if (typeof logo[0] == 'string') {
      uploadReq = of({ success: true, data: [this.oldFiles[0]._id] })
    } else {
      uploadReq = this.apiService.fileUpload(logo, 'brand')
    }
    this.spinner.show();
    uploadReq.subscribe(res => {
      value.logo = res.data[0];
      if (this.editId) value._id = this.editId;
      (this.editId ? this.apiService.updateBrand(value) : this.apiService.addBrand(value)).subscribe((res: any) => {
        this.spinner.hide();
        this.toaster.success(res.message);
        this.router.navigateByUrl('/ecommerce/brands');
      }, () => this.spinner.hide());
    }, () => this.spinner.hide());
  }

  toggleFxn(data: any, value: any) {
    (this.tempSwitchData as any)[value] = !data;
  }
}
