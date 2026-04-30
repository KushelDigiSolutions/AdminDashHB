import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { currentDate, getFormatedDate, time24to12 } from 'src/app/util/date.util';
import { trimInputValue } from 'src/app/util/input.util';
import { DiagnosticsService } from '../diagnostics.service';

@Component({
  standalone: false,
  selector: 'app-create-diagnostic-booking',
  templateUrl: './create-diagnostic-booking.component.html',
  styleUrls: ['./create-diagnostic-booking.component.scss'],
})
export class CreateDiagnosticBookingComponent implements OnInit {
  editId: string;
  userData: any;
  bookingData: any;
  data: any;
  campList = [];
  pincodeFG = this.fb.group({
    Pincode: ['410206', Validators.required],
  });
  form = this.fb.group({
    status: ['', Validators.required],
    type: 'home',
    home: this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
    }),
    OrderBy: [{ value: '', disabled: true }, Validators.required],
    Email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    Mobile: [{ value: '', disabled: true }, Validators.required],
  });
  isPincodeServiceable = -1;
  slotes = [];
  submitted = false;
  minDate = currentDate();
  maxDate;
  intlTelInput = {
    separateDialCode: true,
    preferredCountries: [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom],
    searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
    countryISO: CountryISO,
    PhoneNumberFormat: PhoneNumberFormat,
    selectedCountryISO: CountryISO.India,
  };

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
      this.getBooking();
    }
  }

  get f() {
    return this.form.controls;
  }

  getBooking() {
    this.spinner.show();
    this.diagnosticsService.getDiagnosticBooking(this.editId).subscribe(
      (res) => {
        this.spinner.hide();
        let { data, success } = res;
        if (success) {
          this.bookingData = data;
          this.isPincodeServiceable = 1;
          let { type, orderBy, email, mobile, ApptDate, status } = data;

          let formData: any = {
            status,
            OrderBy: orderBy,
            Email: email,
            Mobile: mobile.startsWith('+') ? mobile : '+91' + mobile,
          };
          if (type == 'home') {
            let apptDate = new Date(ApptDate),
              hours = apptDate.getHours(),
              minutes = apptDate.getMinutes(),
              date = getFormatedDate(ApptDate),
              time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
            this.slotes = [{ slot12: time24to12(time), value: time }];

            formData.home = {
              date,
              time,
            };
          }
          this.form.patchValue(formData);
          this.cdr.markForCheck();
        }
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        if (err.status == 404) {
          this.toastr.error('Booking not found');
          this.router.navigate(['/diagnostics/bookings']);
          return;
        }
        this.toastr.error(err.error?.message || 'Something went wrong');
      },
    );
  }

  checkAvailability() {
    let { valid, value } = this.pincodeFG as any;
    if (valid) {
      this.spinner.show();
      this.diagnosticsService.checkPincodeAvailability(value.Pincode).subscribe(
        (res) => {
          this.spinner.hide();
          let { data, success } = res;
          if (success && data && data.status === 'Y') {
            this.isPincodeServiceable = 1;
          } else {
            this.isPincodeServiceable = 0;
          }
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error(err.error?.message || 'Something went wrong');
        },
      );
    }
  }

  onChangeDate() {
    let { Pincode } = this.pincodeFG.value as any;
    let { date } = (this.form.value as any).home;
    if (this.editId && this.bookingData) {
      Pincode = this.bookingData.pincode;
    }
    if (date && Pincode) {
      this.form.patchValue({
        home: { time: '' },
      } as any);
      this.spinner.show();
      this.toastr.clear();
      this.diagnosticsService.getSlotes({ Pincode, Date: date }).subscribe(
        (res) => {
          this.spinner.hide();
          let { success, data } = res;
          let { lSlotDataRes } = data;
          this.slotes = lSlotDataRes.map((slotData) => {
            let slotArr = slotData.slot.split('-').map((el) => el.trim());
            slotData.value = slotArr[0];
            let [start, end] = slotArr.map((el) => time24to12(el));
            slotData.slot12 = `${start} - ${end}`;
            return slotData;
          });
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error(err.error?.message || 'Something went wrong!');
        },
      );
    }
  }

  onChangeType() {
    let { type } = this.form.value as any;
    if (type == 'camp') {
      (this.form.get('home') as any)
        .disable()(this.form.get('campCollectionId') as any)
        ?.enable();
    } else {
      (this.form.get('home') as any)
        .enable()(this.form.get('campCollectionId') as any)
        ?.disable();
    }
  }

  onChangePincode() {
    this.isPincodeServiceable = -1;
    this.form.patchValue({
      home: {
        date: '',
        time: '',
      },
    } as any);
  }

  trimInputValue(input) {
    trimInputValue(input);
  }

  onSubmit() {
    let { valid, value } = this.form as any;
    this.submitted = true;
    if (valid && (value.type == 'camp' || this.isPincodeServiceable === 1)) {
      let { status, type, home, OrderBy, Email, Mobile } = value;
      let data: any = {
        status,
      };
      if (type == 'home') {
        let { Pincode } = this.pincodeFG.value as any;
        let { date, time } = home;
        data.ApptDate = `${date} ${time}`;
      }
      this.spinner.show();
      this.diagnosticsService.updateBooking(this.editId, data).subscribe(
        (res) => {
          this.spinner.hide();
          const { success } = res;
          if (success) {
            this.toastr.success('Booking updated successfully');
            this.router.navigate(['/diagnostics/bookings']);
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
