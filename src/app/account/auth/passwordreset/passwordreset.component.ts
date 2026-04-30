import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, OnDestroy {

  forgotForm: FormGroup;
  resetForm: FormGroup;
  submitted = {
    forgot: false,
    reset: false
  };
  otpSent = false;
  sec: string = '00';
  intervalRef: any;
  error = '';
  success = '';
  loading = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    document.body.setAttribute('class', 'authentication-bg');
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetForm = this.formBuilder.group({
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalRef);
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotForm.controls; }
  get r() { return this.resetForm.controls; }

  forgotPassword() {
    this.success = '';
    this.error = '';
    this.spinner.show();

    this.authenticationService.forgotPassword(this.forgotForm.value.email)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.otpSent = true;
        this.success = 'Please enter OTP sent to ' + this.f.email.value;
        this.initCounter();
      }, error => {
        this.spinner.hide();
        this.error = error || '';
      });
  }

  onResetPassword() {
    this.success = '';
    this.error = '';
    this.submitted.reset = true;
    let { invalid, value } = this.resetForm;
    let { newPassword, confirmPassword } = value;

    // stop here if form is invalid
    if (invalid || (newPassword != confirmPassword)) return;
    this.spinner.show();
    this.authenticationService.resetPassword({ ...value, email: this.forgotForm.value.email })
      .subscribe((res: any) => {
        this.spinner.hide();
        this.success = 'Password changed successfully! Please login.';
        this.otpSent = false;
        this.router.navigate(['/account', 'login']);
        this.toastr.success('Password changed successfully! Please login.');
      }, error => {
        this.spinner.hide();
        this.error = error || '';
      });
  }

  initCounter() {
    let countdown = 59;
    this.intervalRef = setInterval(() => {
      countdown -= 1;
      if (countdown == 0) {
        clearInterval(this.intervalRef);
      }
      this.sec = String(countdown).length == 1 ? '0' + countdown : '' + countdown;
    }, 1000);
  }

  onChangeEmail() {
    this.otpSent = false;
    this.success = '';
    this.error = '';
    this.submitted = { forgot: false, reset: false };
  }
}
