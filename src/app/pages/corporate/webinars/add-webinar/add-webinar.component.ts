import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { FileUploadResponse, FileUploadService } from 'src/app/core/services/file-upload.service';
import { CorporateService } from '../../corporate.service';

@Component({
  standalone: false,
  selector: 'app-add-webinar',
  templateUrl: './add-webinar.component.html',
  styleUrls: ['./add-webinar.component.scss']
})
export class AddWebinarComponent implements OnInit {
  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Webinar", active: true },
  ];

  editId: string;
  packageId: string;
  oldData: any;
  submitted = false;

  form = this.fb.group({
    webinarId: ["", Validators.required],
    date: ["", Validators.required],
    time: ["", Validators.required],
    duration: [""],
    hostUrl: [""],
    joinUrl: [""],
    platform: [""],
    isActive: true,
    attachments: [[]],
  });
  webinarTemplates = [];
  companyList = [];
  platformList = ["Google Meet", "Microsoft Teams", "Skype", "Zoom"];
  currentDate = new Date();
  minDate: NgbDateStruct = {
    year: new Date(this.currentDate).getFullYear(),
    month: new Date(this.currentDate).getMonth() + 1,
    day: new Date(this.currentDate).getDate(),
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
    private uploadService: FileUploadService
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
    this.getWebinarTemplates();
    this.getCompanyList();
  }

  getWebinarTemplates() {
    this.corporateService.getWebinarList().subscribe((res: any) => {
      this.webinarTemplates = res.data;
    });
  }
  getCompanyList() {
    this.corporateService.getCompanyList().subscribe((res: any) => {
      this.companyList = res.data;
    });
  }
  onSubmit() {
    this.submitted = true;
    let { valid, value } = this.form;

    if (valid) {
      let { attachments, ...rest } = value;
      let uploadReq: Observable<any>[] = [];

      let oldImages = [], newImages = [];
      (attachments as any[]).forEach(image => {
        if (image instanceof File) {
          newImages.push(image)
        } else {
          oldImages.push(image._id)
        }
      });
      uploadReq.push(of({ success: true, data: oldImages }))
      if (newImages.length) uploadReq.push(this.uploadService.fileUpload(newImages, "product/large"))

      this.spinner.show();
      forkJoin(uploadReq).subscribe(
        (res: any) => {
          let reqValue: any = { ...rest };
          reqValue.attachments = [];
          res.forEach(el => {
            el.data.forEach(imgId => {
              reqValue.attachments.push(imgId)
            });
          });
          let dateVal: any = reqValue.date;
          reqValue.date = `${dateVal.year}-${dateVal.month}-${dateVal.day}`;
          reqValue.corporatePackage = this.packageId;
          let req = this.corporateService.createCorporateWebinar(reqValue);
          if (this.editId) {
            req = this.corporateService.updateCorporateWebinar(this.editId, reqValue);
          }

          req.subscribe((res: any) => {
            this.spinner.hide();
            this.toastr.success(this.editId ? 'Webinar details updated' : 'Webinar created successfully');
            this.goBackToList();
          }, () => this.spinner.hide());
        },
        () => this.spinner.hide());
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  getDetails() {
    this.spinner.show();
    this.corporateService.getCorporateWebinar(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      this.oldData = res.data;
      let { webinarId, date, attachments, time, duration, hostUrl, joinUrl, platform, isActive } = this.oldData;
      if (date) {
        let d = new Date(date);
        date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
      }
      this.form.patchValue({
        webinarId: webinarId ? webinarId._id : "",
        date: date || "",
        time: time || "",
        duration: duration || '',
        hostUrl: hostUrl || '',
        joinUrl: joinUrl || '',
        platform: platform || '',
        isActive: isActive != undefined ? isActive : true,
        attachments: attachments || [],
      });
    }, () => this.spinner.hide())
  }

  onDateSelect(date: NgbDate) {
    this.form.patchValue({ date: date as any });
  }

  goBackToList() {
    this.router.navigate(['/admin/corporate/packages', this.packageId], { queryParams: { view: 3 } });
  }
}
