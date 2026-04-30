import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { trimInputValue } from 'src/app/util/input.util';
import { CorporateService } from '../../corporate.service';

@Component({
  standalone: false,
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Company", active: true },
  ];

  editId: string;
  oldData: any;
  submitted = false;

  form = this.fb.group({
    name: ["", Validators.required],
    domain: ["", Validators.required],
    description: "",
    noOfEmployee: [""],
    address: "",
    phone: [null as any],
    email: ["", Validators.email],
    isActive: true,
  });

  intlTelInput = {
    separateDialCode: true,
    preferredCountries: [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom],
    searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
    countryISO: CountryISO,
    PhoneNumberFormat: PhoneNumberFormat,
    selectedCountryISO: CountryISO.India
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
  ) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.getDetails();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const value: any = { ...this.form.value };
      if (value.domain && (value.domain.startsWith('http://') || value.domain.startsWith('https://') || value.domain.startsWith('www.'))) {
        this.toastr.error('Please don\'t use http://, https://, and www in company domain.');
        return;
      }

      if (value.phone && value.phone.e164Number) {
        value.phone = value.phone.e164Number.substr(value.phone.dialCode.length);
      }

      this.spinner.show();
      let req = this.corporateService.createCompany(value);
      if (this.editId) {
        req = this.corporateService.updateCompany(this.editId, value);
      }

      req.subscribe((res: any) => {
        this.spinner.hide();
        this.toastr.success(this.editId ? 'Company details updated' : 'Company created successfully');
        this.goBackToList();

      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Something went wrong!');
      });
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  getDetails() {
    this.spinner.show();
    this.corporateService.getCompany(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      this.oldData = res.data.company;
      const { name, domain, phone, email, noOfEmployee, address, description, isActive } = this.oldData;
      this.form.patchValue({
        name,
        domain,
        phone: phone ? phone : "",
        email: email || '',
        noOfEmployee: noOfEmployee || '',
        address: address || '',
        description: description || '',
        isActive: isActive != undefined ? isActive : true,
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.goBackToList()
    })
  }

  trimInput(input: any) {
    trimInputValue(input)
  }
  goBackToList() {
    this.router.navigateByUrl('/admin/corporate/companies');
  }
}
