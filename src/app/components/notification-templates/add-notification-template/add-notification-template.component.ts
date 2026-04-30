import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';
import { trimInputValue } from 'src/app/util/input.util';

@Component({
  standalone: false,
  selector: 'app-add-notification-template',
  templateUrl: './add-notification-template.component.html',
  styleUrls: ['./add-notification-template.component.scss']
})
export class AddNotificationTemplateComponent implements OnInit {

  breadcrumb = [
    { label: "Home" },
    { label: "Notifications" },
    { label: "Create Template", active: true },
  ];
  editId: string;
  redir: string;
  healthPackageId: string;
  healthPackageBuyId: string;
  form: FormGroup = this.fb.group({
    // type: ['standard'],
    notificationType: ['', Validators.required],
    title: ['', Validators.required],
    message: ['', Validators.required],
    image: [[]],
    healthConcernsId: [[]]
  });
  types = this.notificationsService.types;
  healthConcerns = []

  constructor(
    private fb: FormBuilder,
    public uploadService: FileUploadService,
    private notificationsService: NotificationsService,
    private eCommerceService: EcommerceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id
    this.redir = this.route.snapshot.queryParams.redir
    this.healthPackageId = this.route.snapshot.queryParams.healthPackageId
    this.healthPackageBuyId = this.route.snapshot.queryParams.healthPackageBuyId
    
    if (this.healthPackageId) {
      this.types = this.notificationsService.personalizedTypes
    }


    this.getHealthConcernList();
    if (this.editId)
      this.getDetails()
  }

  get f() {
    return this.form.controls
  }

  getDetails() {
    this.spinner.show()
    this.notificationsService.getNotificationTemplate(this.editId).subscribe(res => {
      this.spinner.hide()
      let { data, success } = res
      if (success && data) {
        let { title, message, image, notificationType = '', healthConcernsId = [] } = data;
        let formData: any = {
          title,
          message,
          notificationType,
          healthConcernsId,
        }
        if (image) formData.image = [image];
        console.log({ formData });

        this.form.patchValue(formData);
      } else {
        this.router.navigate(['/notifications/templates'])
        this.toastr.error("Template not found!")
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })
  }

  getHealthConcernList() {
    this.eCommerceService.getHealthConcernListingAll().subscribe((res: any) => {
      if (res.data) {
        this.healthConcerns = res.data;
      }
    }, (err: any) => {

    });
  }

  searchTemplate(event) {

  }

  onBlur(input) {
    trimInputValue(input);
  }

  onSubmit() {
    let { value, invalid } = this.form;
    if (invalid) return;

    this.uploadService.smartFileUpload(value.image).subscribe(res => {
      value = { ...value }
      let [image] = res.data;
      delete value.image;

      if (image) {
        value.image = image
      }
      if (this.healthPackageId) {
        value.healthPackageId = this.healthPackageId
      }
      if (this.healthPackageBuyId) {
        value.healthPackageBuyId = this.healthPackageBuyId
      }
      this.spinner.show()
      let req = this.notificationsService.createNotificationTemplate(value);
      if (this.editId) req = this.notificationsService.updateNotificationTemplate(this.editId, value);

      req.subscribe(res => {
        this.spinner.hide()
        this.toastr.success(`Template ${this.editId ? 'updated' : 'created'} successfully`)
        if (this.redir) {
          this.router.navigateByUrl(this.redir);
          return;
        }
        this.router.navigate(['/notifications/templates'])
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toastr.error(err.error?.message || 'Something went wrong!')
      });
    })
  }

}
