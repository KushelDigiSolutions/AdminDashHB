import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { LifestyleService } from '../lifestyle.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MyUploadAdapter } from '../add-blog/MyUploadAdapter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';

@Component({
  standalone: false,
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
})
export class ViewBlogComponent implements OnInit {
  @ViewChild('editor') editor;
  public Editor = ClassicEditor;

  user: User;
  breadCrumbItems: Array<{}>;
  s3 = environment.imageUrl;
  editId: string;
  data: any;

  config = {
    link: { addTargetToExternalLinks: true },
  };
  remarksFG = this.fb.group({
    remarks: ['', Validators.required],
  });
  reject = false;

  constructor(
    private authService: AuthenticationService,
    private lifeStyleService: LifestyleService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.editId = this.editId = this.route.snapshot.params.id;
    this.user = this.authService.currentUser();
    this.getBlog();
  }

  getBlog() {
    this.spinner.show();
    this.lifeStyleService.getBlogDetail(this.editId).subscribe(
      (res: any) => {
        this.spinner.hide();
        let { blog } = res;
        this.data = blog;
        this.cdr.markForCheck();
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
      },
    );
  }

  onReadyEditor(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return new MyUploadAdapter(loader);
    };
  }

  accept() {
    this.updateBlog({ _id: this.data._id, approved: true });
  }
  onSubmitRemarks() {
    let { value, valid } = this.remarksFG;
    if (valid) {
      console.log(value);
      this.updateBlog(
        { _id: this.data._id, approved: false, remark: value.remarks },
        this.remarksFG,
      );
    }
  }

  updateBlog(data, form?: FormGroup) {
    let role: any = this.user.role.includes('Editor') ? 'editor' : 'publisher';
    this.spinner.show();
    this.lifeStyleService.update(role, data).subscribe(
      (res: any) => {
        this.spinner.hide();
        form?.reset();
        this.reject = false;
        this.toastr.success('Remark added successfully');
        this.cdr.markForCheck();
        this.getBlog();
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
      },
    );
  }

  isShowBtns() {
    return (
      (this.user.role.includes('Editor') || this.user.role.includes('Publisher')) &&
      (this.data.isApproverApproved?.editor == this.user._id ||
        this.data.isPublisherApproved?.publisher == this.user._id)
    );
  }
  isShowEditBtn() {
    return (
      this.data.createdBy?._id == this.user._id ||
      this.data.isApproverApproved?.editor == this.user._id ||
      this.data.isPublisherApproved?.publisher == this.user._id
    );
  }
  canEdit(data) {
    return this.lifeStyleService.canEdit(data, this.user);
  }
}
