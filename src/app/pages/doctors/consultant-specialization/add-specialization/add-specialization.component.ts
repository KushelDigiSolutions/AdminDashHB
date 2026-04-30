import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
import { EcommerceService } from "src/app/pages/ecommerce/ecommerce.service";
import { environment } from "src/environments/environment";
import { DoctorsService } from "../../doctors.service";

@Component({
  standalone: false,
  selector: "app-add-specialization",
  templateUrl: "./add-specialization.component.html",
  styleUrls: ["./add-specialization.component.scss"],
})
export class AddSpecializationComponent implements OnInit {
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
    private spinner: NgxSpinnerService,
    private router: Router,
    private doctorService: DoctorsService,
    public activeModal: NgbActiveModal
  ) {
    this.form = this.formBuilder.group({
      logo: [[]],
      name: ["", [Validators.required]],
      sequence: [0, Validators.required],
      typeId: [[]],
    });
  }

  ngOnInit() {
    if (this.data.typeId) {
      this.editId = this.data.typeId;
    }
    if (this.editId) {
      this.fetchSpecialization();
    }
    this.getTypes()
  }

  fetchSpecialization() {
    this.spinner.show();
    this.doctorService.getSpecializationDetail(this.editId).subscribe(
      (res: any) => {
        this.spinner.hide();
        let { data } = res;
        this.oldFiles = typeof data.logo == "object" ? [data.logo] : [];
        this.form.patchValue({
          logo: this.oldFiles[0].savedName,
          name: data.name,
          sequence: data.sequence || 0,
          typeId: data.typeId || [],
        });
      },
      (err) => {
        this.spinner.hide();
        this.router.navigateByUrl("/doctors/specialization");
      }
    );
  }

  getTypes() {
    this.apiService.getTypes().subscribe((res: any) => {
      if (res.success) this.categoriesList = res.data;
    }, (err: HttpErrorResponse) => {

    })
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
    this.form.get("logo").markAsTouched();
  }

  SpecialitySelected(event) {

  }

  addSpecialization() {
    let value = { ...this.form.value };
    let { logo } = value;

    let uploadReq: Observable<any>;

    if (typeof logo[0] == "string") {
      uploadReq = of({ success: true, data: [this.oldFiles[0]._id] });
    } else if (!logo.length) {
      uploadReq = of({ success: true, data: [""] });
    } else {
      uploadReq = this.apiService.fileUpload(logo, "specialization");
    }
    this.spinner.show();
    uploadReq.subscribe(
      (res) => {
        if (value.logo.length) {
          value.logo = res.data[0];
        } else {
          delete value.logo;
        }
        if (this.editId) {
          value._id = this.editId;
        }
        (this.editId
          ? this.doctorService.updateSpecialization(value)
          : this.doctorService.addSpecialization(value)
        ).subscribe(
          (res: any) => {
            this.toaster.success(res.message);
            if (this.data) {
              this.spinner.hide();
              this.activeModal.close(res);
            }
          },
          (err: HttpErrorResponse) => {
            this.toaster.error(err.error);
            this.spinner.hide();
          }
        );
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
}
