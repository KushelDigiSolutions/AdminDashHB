import { firstValueFrom } from 'rxjs';
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConsultantApiService } from "src/app/pages/role/consultant/consultant-api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { currentDate, getFormatedDate, time24to12 } from "src/app/util/date.util";
import { trimInputValue } from "src/app/util/input.util";
import { ContactsService } from "src/app/pages/contacts/contacts.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { User } from "src/app/core/models/auth.models";
import { ConsultationService } from "../../consultation/consultation.service";

@Component({
  standalone: false,
  selector: 'app-create-appointment-for-patient',
  templateUrl: './create-appointment-for-patient.component.html',
  styleUrls: ['./create-appointment-for-patient.component.scss']
})
export class CreateAppointmentForPatientComponent implements OnInit {
  @ViewChild('paymentLinkModal') paymentLinkModal;

  breadCrumbItems: Array<{ label: string, active?: boolean }>;
  submit = false;
  consultantList = [];
  userList = [];
  slots = [];
  selectedConsultant: any;

  gender = [{ name: "male" }, { name: "female" }, { name: "other" }];

  form: FormGroup = this.formBuilder.group({
    userId: [null, [Validators.required]],

    date: ["", [Validators.required]],
    primaryTimeSlot: ["", [Validators.required]],
    appointmentMode: [null, [Validators.required]],
    // fee: ["", [Validators.required, Validators.min(0)]],

    paymentCallbackUrl: environment.userAppHost + "payments",
    // status: "Confirmed",
    adminPaymentStatus: "prepaid", //prepaid /paymentLink /cash /free
    paymentMethod: ["paytm", Validators.required], //cod //paytm
    // paymentStatus: "",
    paymentDate: "",
  });
  minDate: string;

  availableTimeSlots = [];

  user: User;
  editId: string;
  userId: string;
  patient: any;
  isConsultant: boolean;


  adminPaymentStatus: {
    enum: ["prepaid", "postpaid", "paymentLink", "cash", "free"];
  }; // All type of payment details will save in this field
  paymentStatus: {
    type: String;
    enum: ["failed", "accepted", "awaited", "refunded"];
  };
  paymentMethod = [
    "cash",
    "payZapp",
    "freeRecharge",
    "card",
    "netBanking",
    "upi",
    "paytm",
    "phonePe",
    "freecharge",
    "olaMoney",
    "airtel",
    "oxigen",
  ];
  appointmentDetails: any;
  queryParams: Params = {};

  constructor(
    private formBuilder: FormBuilder,
    private authServie: AuthenticationService,
    private apiService: ConsultationService,
    private consultantService: ConsultantApiService,
    private contactsService: ContactsService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Patients" },
      { label: "Patient" },
      { label: "Create Appointment", active: true },
    ];

    let { params, queryParams } = this.route.snapshot;
    this.editId = params.id;
    this.userId = params.userId;
    this.queryParams = queryParams;
    this.user = this.authServie.currentUser()
    this.isConsultant = this.user.role.includes('Consultant');

    if (this.editId) {
      this.fetchAppointmentDetail();
    }
    if (this.userId) {
      this.getUserDetail()
      this.getConsultantDetail()
      this.form.patchValue({
        userId: this.userId
      })
    }

    this.setMinDate();
  }

  get f() {
    return this.form.controls
  }

  fetchAppointmentDetail() {
    this.spinner.show();
    firstValueFrom(this.apiService.getAppointmentDetail(this.editId))
      .then((res: any) => {
        if (res.data) {
          this.spinner.hide();
          let { data } = res;

          let [startTime, endTime] = data.primaryTimeSlot.split(' - ');
          this.slots = [{
            startTime,
            endTime,
            startTime12: time24to12(startTime),
            endTime12: time24to12(endTime)
          }];

          this.form.patchValue({
            date: getFormatedDate(data.date, "YYYY-MM-DD"),
            primaryTimeSlot: data.primaryTimeSlot,
            prescription: data.prescription,
            status: data.status,
            adminPaymentStatus: data.adminPaymentStatus,
            // fee: data.fee,
            paymentMethod: data.paymentMethod,
            // paymentStatus: data.paymentStatus,
            paymentDate: data.paymentDate,
            paymentCallbackUrl: environment.userAppHost + "payments",
            // secondaryTimeSlot: data.secondaryTimeSlot,
          });
          console.log("res", this.form.value);
        }
      })
      .catch((err: any) => { });
  }

  onChangeDate() {
    this.form.patchValue({
      primaryTimeSlot: "",
      secondaryTimeSlot: "",
    });
  }

  setMinDate() {
    let date = new Date();
    this.minDate = getFormatedDate(date);
  }

  onChangePaymentType() {
    this.setConsultantFee()
  }

  setConsultantFee() {
    let { value } = this.f.adminPaymentStatus;
    this.form.patchValue({
      fee: value == "free" ? 0 : (this.selectedConsultant?.fee || 0),
    });
  }

  bookAppointment() {
    this.submit = true;
    let value = JSON.parse(JSON.stringify(this.form.value));
    let { healthPackageBuyId, consultant } = this.queryParams
    if (this.form.valid) {
      let data: any = {
        ...value,
        isZoom: true,
        paymentCallbackUrl: environment.userAppHost + "payments",
      };

      if (this.editId) data._id = this.editId
      if (healthPackageBuyId) {
        delete data.adminPaymentStatus
        data.healthPackageBuyId = healthPackageBuyId
      };
      if (consultant) {
        data.consultant = consultant
      }

      console.log("appointment data", data);
      if (this.editId) return;
      this.spinner.show();
      this.editId
        ?
        this.consultantService.updateAppointmentForPatient(data)
          .subscribe((res: any) => {
            this.toaster.success("Appointment updated successfully");
            this.spinner.hide();
          }, (err: any) => {
            this.toaster.error(err.error?.message || "Something went wrong!");
          })
        :
        this.consultantService
          .createAppointmentForPatient(data).subscribe((res: any) => {
            this.spinner.hide();
            this.toaster.success("Appointment Created Successfully");
            if (res.data.adminPaymentStatus == 'paymentLink') {
              this.appointmentDetails = res.data;
              this.openLinkModal(this.paymentLinkModal);
            } else {
              this.router.navigate([this.queryParams.redir || "consultation/appointment"]);
            }
            this.form.reset();
          }, (err: HttpErrorResponse) => {
            this.spinner.hide();
            this.toaster.error(err.error?.message || "Something went wrong!");
          })

      console.log("form", this.form.value);
    } else {
      this.toaster.error("Please fill all fields properly");
      this.spinner.hide();
    }
  }

  openLinkModal(elemRef) {
    this.modalService.open(elemRef, { size: 'lg', windowClass: 'modal-holder', centered: true })
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.toaster.success('Link copied!')
  }

  getSlots() {
    let { date } = this.form.value
    if (!date) return;

    this.f.primaryTimeSlot.setValue('');
    this.spinner.show();
    this.consultantService.getSlots(this.queryParams?.consultant || this.user._id, date, true).subscribe((res: any) => {
      this.spinner.hide();
      this.slots = res.data.slots.filter(el => el.available && !el.isBooked).map(el => {
        el.startTime12 = time24to12(el.startTime)
        el.endTime12 = time24to12(el.endTime)
        return el;
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.slots = [];
    });
  }

  onChangeApptDate() {
    this.getSlots();
  }

  getUserDetail() {
    this.spinner.show()
    this.contactsService.getUserDetail(this.userId).subscribe(res => {
      this.spinner.hide()
      let { success, data } = res
      if (success) {
        this.patient = data;
        this.breadCrumbItems[1].label = data.firstName + ' ' + data.lastName;

        let adminPaymentStatus = data.createdBy == this.user._id ? 'prepaid' : 'paymentLink';
        this.form.patchValue({
          adminPaymentStatus
        })
        if (adminPaymentStatus == 'paymentLink') {
          this.form.controls.paymentMethod.disable()
          // this.form.controls.fee.disable()
        }
      } else this.router.navigate(['/dashboard'], { replaceUrl: true })
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      this.toaster.error(err.error?.message || 'Something went wrong');
      this.router.navigate(['/dashboard'], { replaceUrl: true })
    })
  }

  getConsultantDetail() {
    this.spinner.show()
    this.contactsService.getUserDetail(this.queryParams?.consultant || this.user._id).subscribe(res => {
      this.spinner.hide()
      let { success, data } = res
      if (success) {
        this.selectedConsultant = data;
        // this.setConsultantFee()
        this.getSlots()
      } else this.router.navigate(['/dashboard'], { replaceUrl: true })
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      this.toaster.error(err.error?.message || 'Something went wrong');
      this.router.navigate(['/dashboard'], { replaceUrl: true })
    })
  }

  onBlur(control) {
    trimInputValue(control)
  }
}
