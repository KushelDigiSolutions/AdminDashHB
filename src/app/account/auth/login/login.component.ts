import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from "../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../core/services/authfake.service";

import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  standalone: false,
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  submitted = false;
  error = "";
  returnUrl: string;

  requestedOtp = false;
  counterFinished = false;

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

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    // this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  ngAfterViewInit() { }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    let { valid, value } = this.loginForm;
    // stop here if form is invalid
    if (valid) {
      this.spinner.show();
      this.authenticationService.login(value).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data) {
          let { token, user } = res.data;
          this.toaster.success('Successfully logged in.');
          this.authenticationService.setUser({ ...user, token });
          this.router.navigate(["/dashboard"]);
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


      // if (environment.defaultauth === 'firebase') {
      //   this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
      //     document.body.removeAttribute('class');
      //     this.router.navigate(['/dashboard']);
      //   })
      //     .catch(error => {
      //       this.error = error ? error : '';
      //     });
      // } else {
      //   this.authFackservice.login(this.f.email.value, this.f.password.value)
      //     .pipe(first())
      //     .subscribe(
      //       data => {
      //         this.router.navigate(['/dashboard']);
      //       },
      //       error => {
      //         this.error = error ? error : '';
      //       });
      // }
    }
  }


  onCounterFinished() {
    this.counterFinished = true;
  }

  requestLoginOtp() {
    this.spinner.show();
    let { email } = this.loginForm.getRawValue();
    this.authenticationService.requestLoginOtp({ email }).subscribe((res: any) => {
      this.requestedOtp = true;
      this.counterFinished = false;
      this.spinner.hide();
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    })
  }
}
