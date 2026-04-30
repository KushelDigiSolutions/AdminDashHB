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
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-add-health-concern',
  templateUrl: './add-health-concern.component.html',
  styleUrls: ['./add-health-concern.component.scss']
})
export class AddHealthConcernComponent implements OnInit {

  form: FormGroup;
  healthConcernList = [];
  selectChildren = false;
  childrenList = [];
  s3Base = environment.imageUrl;
  public Editor = ClassicEditor;

  editId:any;
  oldFiles = [];
  files = [];

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
    this.form = this.formBuilder.group({
      logo: [[], Validators.required],
      name: ["", [Validators.required]],
      description: [""],
      metaTitle: [""],
      metaDescription: [""],
      parent: "",
      child: ""
    })
  }

  ngOnInit(){
    firstValueFrom(this.apiService.getHealthConcernList(''))
    .then((res:any)=>{
      if(res.data){
        this.healthConcernList = res.data?.healthConcerns
      }
    })
    .catch((err:any)=>{
      console.log("err",err);
    });

    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.fetchHealthConcern();
    }

  }

  fetchHealthConcern(){
    this.spinner.show();
    this.apiService.getHealthConcern(this.editId).subscribe(res => {
      this.spinner.hide();
      let { data } = res;
      this.oldFiles = typeof data.logo == 'object' ? [data.logo] : [];
      this.form.patchValue({
        logo: this.oldFiles[0].savedName,
        name: data.name,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        parent: data.parent
      })
    }, err => {
      this.spinner.hide();
      this.router.navigateByUrl('/ecommerce/health-concerns');
    });
  }

  onSelect(event) {
    let file = event.addedFiles[0];
    if (file) {
      this.oldFiles = [];
      this.files = [file];
      this.form.patchValue({ logo: this.files });
      this.updateImageControl(this.files);
    }
  }

  onRemove(i: number) {
    this.files.splice(i, 1);
    this.form.patchValue({ logo: this.files });
    this.updateImageControl(this.files);
  }

  onRemoveOldFile(i: number) {
    this.oldFiles.splice(i, 1);
    this.updateImageControl(this.oldFiles);
  }

  updateImageControl(files) {
    this.form.patchValue({ logo: files });
    this.form.get('logo').markAsTouched();
  }
  trim(input: NgModel | AbstractControl) {
    if(input instanceof AbstractControl){
      input.setValue(input.value.trim());
    } else{
      input.control.setValue(input.value.trim());
    }
  }
  addHealthConcern() {
    let value = { ...this.form.value };
    let { logo } = value;

    value.child?value.parent = value.child : value.parent = value.parent;
    !value.parent?delete value.parent:value.parent = value.parent;
    !value.child?delete value.child: value.child = value.child;

    let uploadReq: Observable<any>;
    if (typeof logo[0] == 'string') {
      uploadReq = of({ success: true, data: [this.oldFiles[0]._id] })
    } else {
      uploadReq = this.apiService.fileUpload(logo, 'healthConcern')
    }
    this.spinner.show();
    uploadReq.subscribe(res => {
      value.logo = res.data[0]
      if (this.editId) {
        value._id = this.editId;
      }
      (this.editId ? this.apiService.updateHealthConcern(value) : this.apiService.addHealthConcern(value))
      .subscribe((res: any) => {
        this.spinner.hide();
        this.toaster.success(res.message);
        this.router.navigateByUrl('/ecommerce/health-concerns');
      }, (err: HttpErrorResponse) => {
        this.toaster.error(err.error);
      });
    }, err => {
      this.spinner.hide();
      this.toaster.error(err.error);
    })
  }

  healthConcernSelected(){
    this.healthConcernList.forEach((item)=>{
      if(this.form.get('parent').value == item._id){
        item.children.length?this.selectChildren = true : this.selectChildren = false;
        this.childrenList = item.children;
      }
    })
  }

  childrenSelected(){
    console.log(this.form.get('child').value);
  }
  
}
