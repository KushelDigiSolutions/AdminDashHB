import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';
import { trimInputValue } from 'src/app/util/input.util';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-add-speciality',
  templateUrl: './add-speciality.component.html',
  styleUrls: ['./add-speciality.component.scss']
})
export class AddSpecialityComponent implements OnInit {

  public Editor = ClassicEditor;
  files: Array<File> = [];
  oldFiles = [];
  form: FormGroup;
  s3Base = environment.imageUrl;
  editId: string;
  categoriesList = [];
  subSpecialityList = [];

  dataJson: any;

  @Input()
  set data(data: any) {
    this.dataJson = data;
  }
  get data(): any {
    return this.dataJson;
  }

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apiService: EcommerceService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    public activeModal: NgbActiveModal
  ) {
    this.form = this.formBuilder.group({
      logo: [[]],
      name: ["", [Validators.required]],
      sequence: [0, Validators.required],
      // description: [""],
      metaTitle: [""],
      metaDescription: [""],
      // parent: "",
      // child: ""
    })

  }

  ngOnInit() {

    console.log("dat", this.data);

    if (this.data.typeId) {
      this.editId = this.data.typeId
    }

    // this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.fetchTypes();
    }
    // this.getParentCategories();
  }

  fetchTypes() {
    this.spinner.show();
    this.apiService.getTypeDetail(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      let { data } = res;
      this.oldFiles = typeof data.logo == 'object' ? [data.logo] : [];
      this.form.patchValue({
        logo: this.oldFiles[0].savedName,
        name: data.name,
        sequence: data.sequence || 0,
        // description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      })
    }, err => {
      this.spinner.hide();
      this.router.navigateByUrl('/speciality');
    });
  }

  // getParentCategories(){
  //   this.apiService.getParentCategories()
  //   .toPromise()
  //   .then((res:any)=>{
  //     if(res.data){
  //       this.categoriesList = res.data.categories;
  //     }
  //   })
  //   .catch((err:any)=>{})
  // }

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

  // SpecialitySelected(event){
  //   for(let category of this.categoriesList){
  //     if(category._id == event){
  //       this.subSpecialityList = category.children;
  //       break;
  //     }
  //     else{
  //       this.subSpecialityList = [];
  //     }
  //   }
  // }

  addSpeciality() {
    let value = { ...this.form.value };
    let { logo } = value;

    // value.child?value.parent = value.child : value.parent = value.parent;
    // !value.parent?delete value.parent:'';
    // delete value.child;

    let uploadReq: Observable<any>;

    if (typeof logo[0] == 'string') {
      uploadReq = of({ success: true, data: [this.oldFiles[0]._id] })
    } else if (!logo.length) {
      uploadReq = of({ success: true, data: [""] });
    } else {
      uploadReq = this.apiService.fileUpload(logo, 'type')
    }
    this.spinner.show();
    uploadReq.subscribe(res => {
      if (value.logo.length) {
        value.logo = res.data[0]
      } else {
        delete value.logo;
      }
      if (this.editId) {
        value._id = this.editId;
      }
      // !value.parent?delete value.parent:'';
      (this.editId ? this.apiService.updateTypes(value) : this.apiService.addTypes(value))
        .subscribe((res: any) => {
          this.toaster.success(res.message);
          if (this.data) {
            // if(this.data.path == 'add-doctor'){
            this.spinner.hide();
            this.activeModal.close(res);
            // }
          }
          //  else {
          //   this.spinner.hide();
          //   this.router.navigateByUrl('/speciality');
          // }
        }, (err: HttpErrorResponse) => {
          this.toaster.error(err.error);
          this.spinner.hide();
        })
    }, err => {
      this.spinner.hide();
    })
  }

  trimValue(input) {
    trimInputValue(input)
  }

}
