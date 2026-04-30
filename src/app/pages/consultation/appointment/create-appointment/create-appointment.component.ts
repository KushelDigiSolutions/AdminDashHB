import { firstValueFrom } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { environment } from 'src/environments/environment';
import { ConsultationService } from '../../consultation.service';
import moment from 'moment';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultantApiService } from 'src/app/pages/role/consultant/consultant-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { calculateAge, currentDate, getFormatedDate, time24to12 } from 'src/app/util/date.util';
import { trimInputValue } from 'src/app/util/input.util';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ContactsService } from 'src/app/pages/contacts/contacts.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';

@Component({
  standalone: false,
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss'],
})
export class CreateAppointmentComponent implements OnInit {
  @ViewChild('paymentLinkModal') paymentLinkModal;

  private phoneNumber$ = new Subject<string>();

  public Editor = ClassicEditor;
  s3Base = environment.imageUrl;
  breadCrumbItems: Array<{}>;
  submit = false;
  consultantList = [];
  userList = [];
  slots = [];
  selectedConsultant: any;

  intlTelInput = {
    separateDialCode: true,
    preferredCountries: [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom],
    searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
    countryISO: CountryISO,
    PhoneNumberFormat: PhoneNumberFormat,
    selectedCountryISO: CountryISO.India,
  };

  healthConcerns: any = [];

  gender = [{ name: 'male' }, { name: 'female' }, { name: 'other' }];

  consultationFor = [{ name: 'Self' }, { name: 'Other' }];

  consultationTypes: any = [];

  newUserFormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: '',
    weight: '',
    weightUnit: 'kg',
    gender: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.maxLength(10)]],
    countryCode: '+91',
    email: '',
    DOB: ['', [Validators.required]],
    concern: [],
    // symptoms: "",
    // type: "",
  });

  form: FormGroup = this.formBuilder.group({
    userType: ['guest'],
    userId: [{ value: '', disabled: true }, [Validators.required]],
    guestUser: this.newUserFormGroup,

    consultantId: ['', [Validators.required]],
    date: [currentDate(), [Validators.required]],
    primaryTimeSlot: ['', [Validators.required]],
    appointmentMode: ['', [Validators.required]],
    fee: ['', [Validators.required]],

    paymentCallbackUrl: environment.userAppHost + 'payments',
    status: 'Confirmed',
    prescription: '',
    adminPaymentStatus: '', //prepaid /link /cash /free
    paymentMethod: 'paytm', //cod //paytm
    txnId: '',
    paymentStatus: 'awaited',
    paymentDate: '',
  });
  minDate: string;

  availableTimeSlots = [];
  appointmentStatus = [
    'Payment-Awaited',
    'Confirmed',
    // "Cancelled",
    // "On-Hold",
    // "Follow-up",
    // "Re-scheduled",
    // "Completed",
    // "Closed",
  ];
  user: User;
  editId: string;
  apptData: any;
  userId: string;
  patientData: any;
  isConsultant: boolean;

  paymentType: {
    type: String;
    enum: ['cash', 'payumoney', 'razorpay', 'paypal', 'paytm', 'paymentLink', 'offline', 'free']; //cash to be added
  }; // Admin payment status
  adminPaymentStatus: {
    enum: ['prepaid', 'postpaid', 'paymentLink', 'cash', 'free'];
  }; // All type of payment details will save in this field
  paymentStatus: {
    type: String;
    enum: ['failed', 'accepted', 'awaited', 'refunded'];
  };
  paymentMethod = [
    'cash',
    'payZapp',
    'freeRecharge',
    'card',
    'netBanking',
    'upi',
    'paytm',
    'phonePe',
    'freecharge',
    'olaMoney',
    'airtel',
    'oxigen',
  ];
  appointmentDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private authServie: AuthenticationService,
    private apiService: ConsultationService,
    private consultantService: ConsultantApiService,
    private eCommerceService: EcommerceService,
    private contactsService: ContactsService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Consultation' }, { label: 'Create New', active: true }];

    let { params } = this.route.snapshot;
    this.editId = params.id;
    this.userId = params.userId;
    this.user = this.authServie.currentUser();
    this.isConsultant = this.user.role.includes('Consultant');

    if (this.editId) {
      this.fetchAppointmentDetail();
    }
    if (this.userId) {
      this.getUserDetail();
      this.isConsultant && this.getConsultantDetail();
    }

    this.getConsultants();
    this.getConsultationTypes();
    this.getHealthConcernsAll();
    this.phoneNumber$.pipe(debounceTime(500)).subscribe((value) => {
      if (value) {
        value = value.trim().replace(/ /g, '');
        if (value.length > 4) {
          value = value.indexOf('+91') == 0 ? value.substr(3) : value;
          let data = {
            userIdentifier: value,
            role: 'Consultant',
            active: true,
            activate: true,
          };
          this.eCommerceService.getUserList({ userIdentifier: value }).subscribe(
            (res: any) => {
              this.userList = res.data;
            },
            (err) => {},
          );
        }
      }
    });
  }

  fetchAppointmentDetail() {
    this.spinner.show();
    firstValueFrom(this.apiService.getAppointmentDetail(this.editId))
      .then((res: any) => {
        if (res.data) {
          this.spinner.hide();
          let { data } = res;
          this.apptData = data;
          this.selectedConsultant = data.consultantId;

          // let [startTime, endTime] = data.primaryTimeSlot.split(' - ');
          // this.slots = [{
          //   startTime,
          //   endTime,
          //   startTime12: time24to12(startTime),
          //   endTime12: time24to12(endTime)
          // }];

          this.form.patchValue({
            guestUser: {
              firstName: data.userId?.firstName,
              lastName: data.userId?.lastName,
              weight: data.userId?.weight,
              weightUnit: 'kg',
              gender: data.userId?.gender,
              phone: data.userId?.phone,
              countryCode: '+91',
              email: data.userId?.email,
              DOB: this.getFormatedDate(data.userId?.DOB, 'YYYY-MM-DD'),
              concern: data.userId?.diseases ? data.userId?.diseases.map((el) => el._id) : [],
              // symptoms: data.symptoms,
              // type: data.type._id,
            },
            consultantId: data.consultantId._id,
            date: this.getFormatedDate(data.date, 'YYYY-MM-DD'),
            primaryTimeSlot: data.primaryTimeSlot,
            appointmentMode: data.appointmentMode,
            prescription: data.prescription,
            status: data.status,
            adminPaymentStatus: data.adminPaymentStatus,
            fee: data.fee,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus,
            paymentCallbackUrl: environment.userAppHost + 'payments',
            // secondaryTimeSlot: data.secondaryTimeSlot,
            // consultationFor: data.consultationFor,
          });

          if (data.adminPaymentStatus == 'prepaid') {
            this.form.patchValue({
              txnId: data.payment?.txnId,
              paymentDate: getFormatedDate(data.payment?.txnDate),
            });
          }
          if (data.paymentStatus == 'accepted') {
            this.form.controls.adminPaymentStatus.disable();
          }
          let { consultantId, date } = this.form.value;
          this.getSlots(consultantId, date, true);

          console.log('afterPatch', data.primaryTimeSlot, this.form.value);
        }
      })
      .catch((err: any) => {});
  }

  getHealthConcernsAll() {
    firstValueFrom(this.eCommerceService.getHealthConcernListingAll())
      .then((res: any) => {
        if (res.data) {
          this.healthConcerns = res.data;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.error.message);
      });
  }

  getConsultationTypes() {
    this.apiService.getConsultationTypes().subscribe(
      (res: any) => {
        this.consultationTypes = res.data;
      },
      (err) => {},
    );
  }

  getFormatedDate = (date: Date | string | number, format: string): string => {
    return moment(date).format(format);
  };

  isSameSlots(): boolean {
    let primary = this.form.value.primaryTimeSlot;
    let secondary = this.form.value.secondaryTimeSlot;
    return primary && secondary && primary == secondary;
  }

  onChangePaymentType() {
    console.log(this.form.get('adminPaymentStatus').value);
    this.setConsultantFee();
  }

  setConsultantFee() {
    let { value } = this.apptForm.adminPaymentStatus;
    this.form.patchValue({
      fee: value == 'free' ? 0 : this.selectedConsultant?.fee || 0,
    });
  }

  get apptForm() {
    return this.form.controls;
  }

  get guestUser() {
    return (<FormGroup>this.form.get('guestUser')).controls;
  }

  bookAppointment() {
    this.submit = true;
    let value = JSON.parse(JSON.stringify(this.form.value));
    if (this.editId) {
      delete value.userType;
      delete value.userId;
      delete value.guestUser;
    } else {
      let { phone } = value.guestUser || {};
      if (value.userType == 'guest' && phone) {
        value.guestUser.countryCode = phone.dialCode;
        value.guestUser.phone = phone.e164Number.substr(phone.dialCode.length);
      }
    }
    window['formGroup'] = this.form;
    console.log(this.form.value, this.form);

    if (this.form.valid) {
      let data = {
        ...value,
        isGoogleMeet: true,
        paymentCallbackUrl: environment.userAppHost + 'payments',
        // paymentStatus: "accepted",
        _id: this.editId ? this.editId : '',
      };
      !this.editId && data.userType == 'regsUser' ? delete data.guestUser : null;
      if (this.editId && data.adminPaymentStatus == 'prepaid') {
        data.paymentType = 'offline';
      }

      this.editId ? '' : delete data._id;

      console.log('appointment data', data);
      this.spinner.show();
      this.editId
        ? this.apiService.updateAppointment(data).subscribe(
            (res: any) => {
              this.toaster.success('Appointment updated successfully');
              this.spinner.hide();
            },
            (err: any) => {
              this.toaster.error(err.error?.message || 'Something went wrong!');
            },
          )
        : this.apiService.createAppointment(data).subscribe(
            (res: any) => {
              this.spinner.hide();
              this.toaster.success('Appointment Created Successfully');
              if (res.data.adminPaymentStatus == 'paymentLink') {
                this.appointmentDetails = res.data;
                this.openLinkModal(this.paymentLinkModal);
              } else {
                this.router.navigate(['consultation/appointment']);
              }
              this.form.reset();
            },
            (err: HttpErrorResponse) => {
              this.spinner.hide();
              this.toaster.error(err.error?.message || 'Something went wrong!');
            },
          );

      console.log('form', this.form.value);
    } else {
      this.toaster.error('Please fill all fields properly');
      this.spinner.hide();
    }
  }

  openLinkModal(elemRef) {
    this.modalService.open(elemRef, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.toaster.success('Link copied!');
  }

  getConsultants() {
    let data = {
      role: 'Consultant',
      active: true,
      activate: true,
      limit: 100,
    };
    this.eCommerceService.getUserList(data).subscribe(
      (res: any) => {
        this.consultantList = res.data.map((user) => {
          user.fullName =
            (user.firstName || '') + (user.firstName ? ' ' : '') + (user.lastName || '');
          return user;
        });
      },
      (err) => {},
    );
  }

  getSlots(consultantId, date, presistInputValue?: boolean) {
    if (!presistInputValue) {
      this.apptForm.primaryTimeSlot.setValue('');
    }

    this.spinner.show();
    this.consultantService.getSlots(consultantId, date, true).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.slots = res.data.slots
          .filter((el) => el.available && !el.isBooked)
          .map((el) => {
            el.startTime12 = time24to12(el.startTime);
            el.endTime12 = time24to12(el.endTime);
            return el;
          });
        if (this.editId) {
          if (getFormatedDate(this.apptData.date) == date) {
            let [startTime, endTime] = this.apptData.primaryTimeSlot
              .split('-')
              .map((el) => el.trim());
            this.slots.unshift({
              startTime,
              endTime,
              startTime12: time24to12(startTime),
              endTime12: time24to12(endTime),
            });
          }
        }
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.slots = [];
      },
    );
  }

  onSelectConsultant(event) {
    console.log(event);
    this.selectedConsultant = event;
    let { consultantId, date } = this.form.value;
    let { fee } = event;
    this.form.patchValue({
      fee,
    });
    if (consultantId && date) {
      this.getSlots(consultantId, date);
    }
  }

  onChangeApptDate() {
    let { consultantId, date } = this.form.value;
    if (consultantId && date) {
      this.getSlots(consultantId, date);
    }
  }

  onChangeUserType() {
    let { userType } = this.form.value;
    if (userType == 'guest') {
      this.form.get('guestUser').enable();
      this.form.get('userId').disable();
    } else {
      this.form.get('guestUser').disable();
      this.form.get('userId').enable();
    }
  }

  searchUsers(event) {
    let { value } = event.target;
    this.phoneNumber$.next(value);
  }

  getUserDetail() {
    this.spinner.show();
    this.contactsService.getUserDetail(this.userId).subscribe(
      (res) => {
        this.spinner.hide();
        let { success, data } = res;
        if (success) {
          this.patientData = data;
        } else this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err.error?.message || 'Something went wrong');
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
    );
  }

  getConsultantDetail() {
    this.spinner.show();
    this.contactsService.getUserDetail(this.user._id).subscribe(
      (res) => {
        this.spinner.hide();
        let { success, data } = res;
        if (success) {
          this.selectedConsultant = data;
          this.setConsultantFee();
        } else this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err.error?.message || 'Something went wrong');
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
    );
  }

  getAge(date) {
    return calculateAge(date);
  }

  onBlur(control) {
    trimInputValue(control);
  }
}
