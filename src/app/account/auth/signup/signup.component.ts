import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.formBuilder.group({
    firstName: ["", Validators.required],
    lastName: [""],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  otpForm = this.formBuilder.group({
    otp: ["", Validators.required],
  });

  otpScreen = false;
  showPwd = false;
  submitted = {
    reg: false,
    otp: false
  };
  error = "";
  success: string;
  returnUrl: string;
  intlTelInput = {
    separateDialCode: true,
    preferredCountries: [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom],
    searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
    countryISO: CountryISO,
    PhoneNumberFormat: PhoneNumberFormat,
    selectedCountryISO: CountryISO.India
  }

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    document.body.setAttribute("class", "authentication-bg");

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    // this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }
  get otpF() {
    return this.otpForm.controls;
  }

  changeEmail() {
    this.otpScreen = false;
    this.otpForm.reset();
    this.submitted.otp = false;
  }

  resendOtp() {
    let { email } = this.signupForm.value;
    this.spinner.show()
    this.authenticationService.resendOtp({ email }).subscribe(res => {
      this.spinner.hide()
      this.counterFinished = false;
      this.toaster.success('OTP Re-sent successfully')
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      this.toaster.error(err.error?.message || 'Something went wrong!');
    });
  }

  /**
   * Form submit
   */
  checkUser() {
    let { valid, value } = this.signupForm;
    this.submitted.reg = true;
    value = JSON.parse(JSON.stringify(value));
    // stop here if form is invalid
    console.log(value);

    if (valid) {
      // value.countryCode = value.phone.dialCode
      // value.phone = value.phone.e164Number.substr(value.phone.dialCode.length)

      console.log(value);
      // return
      this.spinner.show();
      this.authenticationService.checkuser(value).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data) {
          let { token, user } = res.data;
          this.otpScreen = true;
          this.success = "OTP have been sent to <b>" + value.email + "</b>";
          // this.toaster.success('Successfully logged in.');

          // this.authenticationService.setUser({ ...user, token });
          // this.router.navigate(["/dashboard"]);
        }
      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
        if (err.error?.message === 'userNotFound') {
          this.toaster.error('User not found!');
        } else if (err.error?.message === 'UserNotVerified') {
          this.toaster.error('User not verified!');
        } else {
          this.toaster.error(err.error?.message || 'Something went wrong!');
        }
      })

    }
  }

  onSubmit() {
    let { valid, value } = this.otpForm;
    let { value: signUpValue } = this.signupForm;

    this.submitted.otp = true;
    if (valid) {
      let { otp } = value,
        { email, password, firstName, lastName } = signUpValue,
        cartId = '';
      this.spinner.show()
      this.authenticationService.registerCorporateUser({ otp, cartId, email, password, firstName, lastName }).subscribe((res: any) => {
        this.spinner.hide()
        let { token, user } = res.data;
        this.toaster.success('Successfully Signed Up.');

        if (!environment.production) {
          if (confirm('Want to logged in as corporate user?')) {
            user.role = ["User", "CorporateUser"];
          }
        }
        this.authenticationService.setUser({ ...user, token });
        this.router.navigate(["/corporate"]);

      }, (err: HttpErrorResponse) => {
        this.spinner.hide()

      });
    }
  }

  counterFinished = false;
  onCounterFinished() {
    this.counterFinished = true
  }
}
