import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { CorporateService } from '../../corporate.service';

@Component({
  standalone: false,
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit, OnDestroy {
  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Email", active: true },
  ];

  editId: string;
  packageId: string;
  oldData: any;
  submitted = false;

  form = this.fb.group({
    subject: ["", Validators.required],
    buttonText: ["", Validators.required],
    buttonLink: ["", Validators.required],
    bodyText: ["", Validators.required],
    image: [[] as any[], Validators.required],
  });

  companies = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
    private uploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    this.packageId = this.route.snapshot.queryParams.package;

    if (!this.packageId) {
      this.router.navigateByUrl('/admin/corporate/packages', { replaceUrl: true });
    }

    if (this.editId) {
      this.getDetails();
    }
    this.getCompanies();
  }

  ngOnDestroy() {
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const value: any = { ...this.form.value };
      const image = value.image;
      delete value.image;

      this.spinner.show();
      this.uploadService.fileUpload(image, "").subscribe(res => {
        value.image = res.data[0];
        value.corporatePackage = this.packageId;
        
        let req = this.corporateService.createEmail(value);
        if (this.editId) {
           req = this.corporateService.updateEmail(this.editId, value);
        }

        req.subscribe((res: any) => {
          this.spinner.hide();
          this.toastr.success(this.editId ? 'Email updated successfully' : 'Email created successfully');
          this.goBackToList();
        }, (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error(err.error?.message || 'Something went wrong!');
        });
      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Something went wrong!');
      })
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  getDetails() {
    this.spinner.show();
    this.corporateService.getEmail(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      this.oldData = res.data;
      const { subject, buttonText, buttonLink, bodyText, image } = this.oldData;
      this.form.patchValue({
        subject: subject || "",
        buttonText: buttonText || "",
        buttonLink: buttonLink || "",
        bodyText: bodyText || "",
        image: (image ? [image] : []) as any,
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.goBackToList()
    })
  }

  getCompanies() {
    this.corporateService.getCompanyList().subscribe((res: any) => {
      this.companies = res.data;
    }, (err: HttpErrorResponse) => {
    })
  }

  goBackToList() {
    this.router.navigate(['/admin/corporate/packages', this.packageId], { queryParams: { view: 'emaillogs' } });
  }
}
