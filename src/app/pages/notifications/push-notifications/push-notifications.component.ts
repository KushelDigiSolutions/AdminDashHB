import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService, RequestHttpParams } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { HealthPackagesService } from 'src/app/core/services/health-packages.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { getFormatedDate } from 'src/app/util/date.util';
import { trimInputValue } from 'src/app/util/input.util';

@Component({
  standalone: false,
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationsComponent implements OnInit {

  breadCrumbItems = [{ label: 'Push Notifications' }, { label: 'Push Notification', active: true }];

  editId: string;
  isConsultant: boolean = false;
  url: string;
  healthPackageId: string;
  healthPackageBuyId: string;
  templateCloneId: string;

  queryParams: Params = {};
  userList = [];
  files = [];
  templates = [];

  timeSlots = this.notificationsService.getTimeSlots()
  form = this.fb.group({
    templateId: ['', Validators.required],
    // notificationType: ['', Validators.required],
    // date: [''],
    time: ['']
    // users: [{ value: [], disabled: true }, Validators.required],
  });

  types = this.notificationsService.types;

  minDate = getFormatedDate(new Date());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private notificationsService: NotificationsService,
    private taost: ToastService,
    private healthPackageService: HealthPackagesService,
  ) { }

  ngOnInit(): void {
    this.url = this.router.url
    this.queryParams = this.route.snapshot.queryParams;
    this.healthPackageId = this.queryParams.healthPackageId;
    this.healthPackageBuyId = this.queryParams.healthPackageBuyId;
    this.isConsultant = this.authService.currentUser().role.includes('Consultant');

    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.getNotification()
    }

    if (this.healthPackageBuyId) {
      this.types = this.notificationsService.personalizedTypes;
      this.getSubscribedHealthPackage()
    } else {
      this.getTemplates()

    }
  }

  getSubscribedHealthPackage() {
    this.healthPackageService.getSubscribedPackageDetail(this.healthPackageBuyId).subscribe(res => {
      let { success, data } = res
      let queryParams: any = {
        emptyHealthConcern: true,
        notificationType: [...this.notificationsService.types.map(el => el.value), ...this.notificationsService.personalizedTypes.map(el => el.value)]
      }

      if (this.healthPackageId) {
        queryParams.healthPackageId = this.healthPackageId
      }

      if (success && data.healthPackageId) {
        data.healthPackageId?.healthConcerns
        queryParams.healthConcern = data.healthPackageId?.healthConcerns
      }
      if (this.healthPackageBuyId) queryParams.healthPackageBuyId = this.healthPackageBuyId;

      this.getTemplates(queryParams)
    }, (err: HttpErrorResponse) => {
      this.taost.error(err.error?.message)
      this.router.navigateByUrl(this.route.snapshot.queryParams.redir || '/');
    })
  }

  getTemplates(queryParams?: RequestHttpParams) {

    this.notificationsService.getNotificationTemplates(queryParams).subscribe(res => {
      let { success, data } = res;
      if (success && data) {
        this.templates = data
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  get f() {
    return this.form.controls
  }
  // onSelectImage(event) {
  //   let file = event.addedFiles[0];
  //   if (file) this.files = [file];
  // }

  // onRemoveImage(file) {
  //   console.log('onremove', file);
  //   this.files.splice(this.files.indexOf(file), 1);
  // }

  onSelectTemplate(event) {

  }

  searchTemplate(event) {

  }

  onChangeType() {
    let { type } = this.form.value as any;
    if (type == 'all') {
      this.form.get('users').disable();
    } else {
      this.form.get('users').enable();
    }
  }

  onBlur(input) {
    trimInputValue(input);
  }

  getNotification() {
    this.spinner.show()
    this.notificationsService.getNotification(this.editId).subscribe(res => {
      this.spinner.hide()
      let { data, success } = res
      if (success) {
        let { templateId, notificationType, time } = data
        this.form.patchValue({
          templateId: templateId._id,
          // notificationType,
          time,
        })
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })
  }

  createPersonlizedTemplate(templateId) {
    let template = this.templates.find(el => el._id == templateId)
    if (template) {
      let { _id, title, message, image, notificationType } = template;

      if (this.notificationsService.personalizedTypes.findIndex(el => el.value == notificationType) != -1) {
        this.templateCloneId = _id
        return this.onSubmit()
      }

      image = image?._id || image;
      notificationType = this.notificationsService.personalizedTypes.find(el => el.originalType == notificationType).value || null;

      let requestBody = {
        title,
        message,
        image,
        notificationType: notificationType,
        healthPackageId: this.healthPackageId,
        healthPackageBuyId: this.healthPackageBuyId,
      }
      this.notificationsService.createNotificationTemplate(requestBody).subscribe((res: any) => {
        this.taost.success('Template cloned successfully')
        let { success, data } = res
        if (success) {
          this.templateCloneId = data._id
          this.onSubmit()
        } else {
          this.spinner.hide()
        }
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.taost.error(err.error?.message)
      })
    }
  }

  onSubmit() {
    let value: any = { ...this.form.value };

    this.spinner.show();
    let req = this.notificationsService.createNotification(value);
    if (!this.editId && this.queryParams.healthPackageBuyId) {
      value.healthPackageId = this.queryParams.healthPackageId
      value.healthPackageBuyId = [this.queryParams.healthPackageBuyId]

      if (this.templateCloneId) {
        value.templateId = this.templateCloneId
      } else {
        this.createPersonlizedTemplate(value.templateId)
      }
    }
    if (this.editId) {
      req = this.notificationsService.updateNotification(this.editId, value)
    }
    req.subscribe((res: any) => {
      this.spinner.hide();
      this.taost.success(`Notification ${this.editId ? 'updated' : 'created'} successfully`)

      if (this.queryParams.redir) {
        this.router.navigateByUrl(this.queryParams.redir)
      }
      this.router.navigate(['/notifications']);
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.taost.error(err.error?.message)
    })
  }
}
