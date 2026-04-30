import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DiagnosticsService } from '../../diagnostics/diagnostics.service';

@Component({
  standalone: false,
  selector: 'app-corporate-diagnostic',
  templateUrl: './corporate-diagnostic.component.html',
  styleUrls: ['./corporate-diagnostic.component.scss']
})
export class CorporateDiagnosticComponent implements OnInit {

  private search$ = new Subject();

  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Diagnostic Package", active: true },
  ];
  form = this.fb.group({
    testId: ['', Validators.required],
    isAvailableInCampCollection: [false],
  })
  editId: any;
  packageId: any;
  submitted = false;
  testList = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private diagnostics: DiagnosticsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
        this.search$.pipe(debounceTime(500)).subscribe(this.searchProducts.bind(this))
        this.packageId = this.route.snapshot.queryParams.package;
        this.editId = this.route.snapshot.params.id;

        if (this.editId) {
          this.getDiagnosticPackageDetails();
        }
    });
  }

  onSearchProducts(event) {
    this.search$.next(event.target.value)
  }

  searchProducts(val: string) {
    this.diagnostics.searchProducts({ keyword: val, type: ['PROFILE', 'OFFER', 'TEST'], }).subscribe(res => {
      let { success, data } = res;
      if (success) {
        setTimeout(() => {
            this.testList = data;
            this.cdr.detectChanges();
        });
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  getDiagnosticPackageDetails() {
    this.diagnostics.getCorporateDiagnosticPackage(this.editId).subscribe(res => {
      let { data, success } = res;
      if (success && data) {
        setTimeout(() => {
            let { testId, isAvailableInCampCollection } = data;
            this.testList = [testId];

            this.form.patchValue({
              testId: testId._id,
              isAvailableInCampCollection
            });
            this.cdr.detectChanges();
        });

      } else {
        this.toastr.error('Diagnostic package not found')
        history.back()
      }
    }, (err: HttpErrorResponse) => {
      this.toastr.error(err.error?.message || 'Something went wrong');
    });
  }

  onSubmit() {
    this.submitted = true;
    let { value, valid } = this.form
    if (valid) {
      this.spinner.show();

      let req = this.diagnostics.createCorporateDiagnosticPackage({ corporatePackageId: this.packageId, ...value } as any);
      if (this.editId) {
        req = this.diagnostics.updateCorporateDiagnosticPackage(this.editId, value as any);
      }
      req.subscribe(res => {
        this.spinner.hide();
        let { success } = res;
        if (success) {
          this.toastr.success(`Diagnostic Package ${this.editId ? 'Updated' : 'Created'} Successfully`)
          this.router.navigate(['/admin/corporate/packages', this.packageId], { queryParams: { view: 'diagnostics' } })
        }
      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Something went wrong!');
      })
    }
  }
}
