import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { FileUploadResponse, FileUploadService } from 'src/app/core/services/file-upload.service';
import { environment } from 'src/environments/environment';

import { CorporateService } from '../../corporate.service';

@Component({
  standalone: false,
  selector: 'app-add-webinar-template',
  templateUrl: './add-webinar-template.component.html',
  styleUrls: ['./add-webinar-template.component.scss']
})
export class AddWebinarTemplateComponent implements OnInit {
  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Webinar", active: true },
  ];

  editId: string;
  oldData: any;
  submitted = false;
  s3Base = environment.imageUrl;
  
  form = this.fb.group({
    thumbnail: [[], Validators.required],
    attachments: [[]],
    title: ["", Validators.required],
    description: [""],
    metaTitle: "",
    metaDescription: "",
    isActive: true,
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
    private uploadService: FileUploadService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.getDetails();
    }
  }

  onSubmit() {
    this.submitted = true;
    let { valid, value } = this.form;
    const rest = { ...value };
    delete (rest as any).thumbnail;
    delete (rest as any).attachments;

    if (valid) {
      const thumbnail = value.thumbnail as any[];
      const attachments = (value.attachments as any[]) || [];
      let uploadReq: Observable<FileUploadResponse | null>[] = [];
      
      if (thumbnail && thumbnail[0] instanceof File) {
        uploadReq.push(this.uploadService.fileUpload(thumbnail))
      } else if (thumbnail && thumbnail[0]) {
        uploadReq.push(of({ success: true, data: [thumbnail[0]._id] } as FileUploadResponse))
      } else {
        uploadReq.push(of(null))
      }

      let oldImages = [], newImages = [];
      attachments.forEach(image => {
        if (image instanceof File) {
          newImages.push(image)
        } else {
          oldImages.push(image._id)
        }
      });
      uploadReq.push(of({ success: true, data: oldImages } as FileUploadResponse))
      if (newImages.length) {
        uploadReq.push(this.uploadService.fileUpload(newImages))
      }

      this.spinner.show();
      forkJoin(uploadReq).subscribe(
        (res) => {
          const processedValue: any = { ...rest };
          let [thumbnailRes, ...imagesRes] = res;
          if (thumbnailRes && thumbnailRes.data && thumbnailRes.data[0]) {
            processedValue.thumbnail = thumbnailRes.data[0];
          }
          processedValue.attachments = [];
          imagesRes.forEach(el => {
            if (el && el.data) {
              el.data.forEach(imgId => {
                processedValue.attachments.push(imgId)
              });
            }
          });

          let req = this.corporateService.createWebinar(processedValue);
          if (this.editId) {
            req = this.corporateService.updateWebinar(this.editId, processedValue);
          }

          this.spinner.show();
          req.subscribe((res: any) => {
            this.spinner.hide();
            this.toastr.success(this.editId ? 'Webinar details updated' : 'Webinar created successfully');
            this.goBackToList();

          }, (err: HttpErrorResponse) => {
            this.spinner.hide();
          });
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toaster.error(err.error?.message || 'Something went wrong');
        })

    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  getDetails() {
    this.spinner.show();
    this.corporateService.getWebinar(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      this.oldData = res.data;
      let { title, description, thumbnail, attachments, metaTitle, metaDescription, isActive } = this.oldData;
      this.form.patchValue({
        title,
        description: description || "",
        thumbnail: (thumbnail ? [thumbnail] : []) as any,
        attachments: (attachments || []) as any,
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || '',
        isActive: isActive != undefined ? isActive : true,
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.goBackToList()
    })
  }

  goBackToList() {
    this.router.navigateByUrl('/admin/corporate/webinar-templates');
  }
}
