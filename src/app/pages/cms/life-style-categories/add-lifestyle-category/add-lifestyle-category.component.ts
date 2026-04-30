import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CmsService } from '../../cms.service';

@Component({
  standalone: false,
  selector: 'app-add-lifestyle-category',
  templateUrl: './add-lifestyle-category.component.html',
  styleUrls: ['./add-lifestyle-category.component.scss']
})
export class AddLifestyleCategoryComponent implements OnInit {

  public Editor = ClassicEditor;
  files: Array<File> = [];
  oldFiles = [];
  form: FormGroup;
  s3Base = environment.imageUrl;
  editId: string;
  hasParent: boolean = false;
  categoriesList = [];
  subCategoryList = []

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private cmsService: CmsService,
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
      categoryType: "LifeStyle",
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
    this.cmsService.getLifestyleCategory(this.editId).subscribe(res => {
      this.spinner.hide();
      let { data } = res;
      this.hasParent = !!data.parent
      this.oldFiles = typeof data.image == 'object' ? [data.image] : [];
      this.form.patchValue({
        image: this.oldFiles[0].savedName,
        name: data.name,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        categoryType: "LifeStyle",
      })
    }, err => {
      this.spinner.hide();
      this.router.navigateByUrl('/ecommerce/category');
    });
  }

  getParentCategories(){
    firstValueFrom(this.cmsService.getParentLifestyleCategories())
    .then((res:any)=>{
      if(res.data){
        this.categoriesList = res.data.categories?.filter(data => data.categoryType == 'LifeStyle');
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
      uploadReq = this.cmsService.fileUpload(image,'')
    }
    this.spinner.show();
    uploadReq.subscribe(res => {
      value.image = res.data[0]
      this.cmsService.addLifestyleCategory(value)
      if (this.editId) {
        value._id = this.editId;
      }
      !value.parent?delete value.parent:'';
      (this.editId ? this.cmsService.updateLifestyleCategory(value) : this.cmsService.addLifestyleCategory(value))
        .subscribe((res: any) => {
          this.toaster.success(res.message);
          this.router.navigateByUrl('/lifeStyleCategories');
        }, (err: HttpErrorResponse) => {
          this.toaster.error(err.error);
          this.spinner.hide();
        })
    }, err => {
      this.spinner.hide();
    })
  }
}
