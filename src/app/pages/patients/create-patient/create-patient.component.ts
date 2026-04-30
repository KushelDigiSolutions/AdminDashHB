import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { trimInputValue } from 'src/app/util/input.util';
import { EMAIL_PATTERN } from 'src/app/util/pattern.util';
import { ConsultantApiService } from '../../role/consultant/consultant-api.service';

@Component({
  standalone: false,
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {

  breadCrumbItems = [
    { label: "Home" },
    { label: "Create Patient", active: true },
  ];

  reqError: string;
  submitted = false;

  intlTelInput = {
    separateDialCode: true,
    preferredCountries: [],
    searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
    onlyCountries: [CountryISO.India],
    countryISO: CountryISO,
    PhoneNumberFormat: PhoneNumberFormat,
    selectedCountryISO: CountryISO.India
  }

  form = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    phone: ["", [Validators.required]],
    gender: ["male", [Validators.required]],
    DOB: [null],
    bodyType: [""],
  });

  constructor(
    private fb: FormBuilder,
    private api: ConsultantApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  get f() {
    return this.form.controls
  }

  onSubmit() {
    this.reqError = '';
    this.submitted = true;

    let { invalid, value } = this.form,
      { phone } = value;

    if (invalid) return;
    let body: any = { 
 ...value,
      countryCode: ((phone as any).dialCode as string),
      phone: (phone as any).e164Number.slice(((phone as any).dialCode as string).length)
    }
    this.spinner.show();
    this.api.createPatient(body).subscribe((res: any) => {
      this.spinner.hide();
      this.toastr.success('Patient created successfully');
      this.router.navigate(['/patients'])
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.reqError = err.error?.message || "Something went wrong!"
    });
  }

  trimValue(input) {
    trimInputValue(input)
  }

}
