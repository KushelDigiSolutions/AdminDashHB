import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LifestyleService } from 'src/app/pages/lifestyle/lifestyle.service';

import { CorporateService } from '../../corporate.service';

@Component({
  standalone: false,
  selector: 'app-add-corporate-lifestyle-tips',
  templateUrl: './add-corporate-lifestyle-tips.component.html',
  styleUrls: ['./add-corporate-lifestyle-tips.component.scss']
})
export class AddCorporateLifestyleTipsComponent implements OnInit, OnDestroy {

  subject$ = new Subject<string>();
  subscription$: Subscription;

  breadcrumb = [
    { label: "Corporate" },
    { label: "Add Lifestyle Tip", active: true },
  ];

  editId: string;
  packageId: string;
  oldData: any;
  submitted = false;

  form = this.fb.group({
    lifestyleTip: ["", Validators.required],
    isActive: true,
  });

  lifestyleTips = [];
  companyList = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
    private lifestyleService: LifestyleService,
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
    this.searchLifestyleTips();
    this.getCompanyList();
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe()
  }

  get f() {
    return this.form.controls;
  }

  searchLifestyleTips() {
    this.subscription$ = this.subject$.pipe(debounceTime(400)).subscribe(value => {
      if (value && (value = value.trim())) {
        this.lifestyleService.algoliaSearch(value, 20).subscribe((res: any) => {
          this.lifestyleTips = res.data
        }, (err: HttpErrorResponse) => {

        });

      }
    });
  }

  getCompanyList() {
    this.corporateService.getCompanyList().subscribe((res: any) => {
      this.companyList = res.data;
    }, (err: HttpErrorResponse) => {

    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const value: any = { ...this.form.value };
      value.corporatePackage = this.packageId;

      this.spinner.show();
      let req = this.corporateService.addLifestyleTip(value);
      if (this.editId) {
        req = this.corporateService.updateLifestyleTip(this.editId, value);
      }

      req.subscribe((res: any) => {
        this.spinner.hide();
        this.toastr.success(this.editId ? 'Lifestyle Tip Linking updated' : 'Lifestyle Tip added to corporate successfully');
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
    this.corporateService.getLifestyleTip(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.data) {
        this.toastr.error('Data not found!');
        return this.goBackToList()
      }
      this.oldData = res.data;
      let { lifestyleTip, isActive } = this.oldData;

      if (lifestyleTip) {
        this.lifestyleTips = [lifestyleTip]
      }

      this.form.patchValue({
        lifestyleTip: lifestyleTip ? lifestyleTip._id : "",
        isActive: isActive != undefined ? isActive : true,
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.goBackToList()
    })
  }

  goBackToList() {
    this.router.navigate(['/admin/corporate/packages', this.packageId], {queryParams: {view: 'lifestyletips'}});
  }

}
