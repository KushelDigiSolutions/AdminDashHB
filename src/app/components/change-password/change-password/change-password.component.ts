import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';

@Component({
  standalone: false,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  breadCrumbItems = [
    { label: "Home" },
    { label: "Change Password", active: true },
  ];
  form = this.fb.group({
    oldPassword: ["", Validators.required],
    newPassword: ["", [Validators.required, Validators.minLength(6)]],
    confirmPassword: ["", [Validators.required, Validators.minLength(6)]]
  });
  reqError: string;

  constructor(
    private fb: FormBuilder,
    private api: EcommerceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

  }

  onSubmit() {
    this.reqError = '';
    let { invalid, value } = this.form;
    let { oldPassword, newPassword, confirmPassword } = value;

    if (invalid || newPassword != confirmPassword) return;

    const body = {
      oldPassword,
      newPassword,
      confirmPassword
    };
    this.spinner.show();
    this.api.changePassword(body).subscribe((res: any) => {
      this.spinner.hide();
      this.form.reset();
      this.toastr.success('Password changed successfully');
    }, (err: string) => {
      this.spinner.hide();
      this.reqError = err || "Something went wrong!"
    });
  }

}
