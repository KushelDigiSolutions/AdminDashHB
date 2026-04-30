import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { getFormatedDate, time24to12 } from 'src/app/util/date.util';
import { trimInputValue } from 'src/app/util/input.util';
import { DiagnosticsService } from '../diagnostics.service';

@Component({
  standalone: false,
  selector: 'app-create-diagnostic-test',
  templateUrl: './create-diagnostic-test.component.html',
  styleUrls: ['./create-diagnostic-test.component.scss'],
})
export class CreateDiagnosticTestComponent implements OnInit {
  editId: string;
  userData: any;
  data: any;

  form = this.fb.group({
    hbDiscount: [null, [Validators.min(0), Validators.max(100)]],
    costPrice: [null, [Validators.min(0)]],
    description: [''],
    metaTitle: [''],
    metaDescription: [''],
    process: this.fb.array([]),
  });

  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserProfileService,
    private authService: AuthenticationService,
    private diagnosticsService: DiagnosticsService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.getDetails();
    }
  }

  get f() {
    return this.form.controls;
  }

  get process() {
    return <FormArray>this.form.controls.process;
  }

  addProcess(process: string = '') {
    this.process.push(this.fb.control(process, Validators.required));
  }

  removeProcess(i: number) {
    this.process.removeAt(i);
  }

  getDetails() {
    this.spinner.show();
    this.diagnosticsService.getProductDetails(this.editId).subscribe(
      (res) => {
        this.spinner.hide();
        let { data, success } = res;
        if (success && data) {
          this.data = data.productDetail;
          let {
            hbDiscount,
            costPrice,
            shortDescription,
            description,
            metaTitle,
            metaDescription,
            process,
          } = this.data;

          this.form.patchValue({
            hbDiscount,
            costPrice,
            description,
            metaTitle,
            metaDescription,
          } as any);
          if (process) {
            process.forEach((el) => {
              this.addProcess(el);
            });
          }
          this.cdr.markForCheck();
        }
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        if (err.status == 404) {
          this.toastr.error('Booking not found');
          this.router.navigate(['/diagnostics']);
          return;
        }
        this.toastr.error(err.error?.message || 'Something went wrong');
      },
    );
  }

  trimInputValue(input) {
    trimInputValue(input);
  }

  onSubmit() {
    let { valid, value } = this.form;
    this.submitted = true;
    if (valid) {
      this.spinner.show();
      this.diagnosticsService.updateProduct(this.editId, value).subscribe(
        (res) => {
          this.spinner.hide();
          const { success } = res;
          if (success) {
            this.toastr.success('Lab test updated successfully');
            this.router.navigate(['/diagnostics']);
          }
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          if (err.error?.customMessage) {
            this.toastr.success('Our support team will reach out for confirmation of booking');
          } else {
            this.toastr.error(
              err.error?.customMessage || err.error?.message || 'Something went wrong',
            );
          }
        },
      );
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }
}
