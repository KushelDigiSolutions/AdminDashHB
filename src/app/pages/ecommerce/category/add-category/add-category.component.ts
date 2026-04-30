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
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  public Editor = ClassicEditor;
  files: Array<File> = [];
  oldFiles = [];
  form: FormGroup;
  s3Base = environment.imageUrl;
  editId: string;
  categoriesList = [];
  subCategoryList = []

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apiService: EcommerceService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      image: [[], [Validators.required]],
      name: ["", [Validators.required]],
      description: [""],
      metaTitle: [""],
      metaDescription: [""],
      parent: "",
      child: ""
    })
  }

  ngOnInit() {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.fetchCategory();
    }
    this.getParentCategories();
  }

  fetchCategory() {
    this.spinner.show();
    this.apiService.getCategory(this.editId).subscribe(res => {
      this.spinner.hide();
      let { data } = res;
      this.oldFiles = typeof data.image == 'object' ? [data.image] : [];
      this.form.patchValue({
        image: this.oldFiles[0].savedName,
        name: data.name,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      })
    }, err => {
      this.spinner.hide();
      this.router.navigateByUrl('/ecommerce/category');
    });
  }

  getParentCategories(){
    firstValueFrom(this.apiService.getParentCategories())
    .then((res:any)=>{
      if(res.data){
        this.categoriesList = res.data.categories;
      }
    })
    .catch((err:any)=>{})
  }

  onSelect(event) {
    let file = event.addedFiles[0];
    if (file) {
      this.oldFiles = [];
      this.files = [file];
      this.form.patchValue({ image: this.files });
      this.updateImageControl(this.files);
    }
  }

  onRemove(i: number) {
    this.files.splice(i, 1);
    this.form.patchValue({ image: this.files });
    this.updateImageControl(this.files);
  }

  onRemoveOldFile(i: number) {
    this.oldFiles.splice(i, 1);
    this.updateImageControl(this.oldFiles);
  }

  updateImageControl(files) {
    this.form.patchValue({ image: files });
    this.form.get('image').markAsTouched();
  }

  categorySelected(event){
    for(let category of this.categoriesList){
      if(category._id == event){
        this.subCategoryList = category.children;
        break;
      }
      else{
        this.subCategoryList = [];
      }
    }
  }

  addCategory() {
    let value = { ...this.form.value };
    let { image } = value;

    value.child?value.parent = value.child : value.parent = value.parent;
    !value.parent?delete value.parent:'';
    delete value.child;

    let uploadReq: Observable<any>;
    if (typeof image[0] == 'string') {
      uploadReq = of({ success: true, data: [this.oldFiles[0]._id] })
    } else {
      uploadReq = this.apiService.fileUpload(image)
    }
    this.spinner.show();
    uploadReq.subscribe(res => {
      value.image = res.data[0]
      this.apiService.addCategory(value)
      if (this.editId) {
        value._id = this.editId;
      }
      !value.parent?delete value.parent:'';
      (this.editId ? this.apiService.updateCategory(value) : this.apiService.addCategory(value))
        .subscribe((res: any) => {
          this.toaster.success(res.message);
          this.router.navigateByUrl('/ecommerce/category');
        }, (err: HttpErrorResponse) => {
          this.toaster.error(err.error);
          this.spinner.hide();
        })
    }, err => {
      this.spinner.hide();
    })
  }


}
