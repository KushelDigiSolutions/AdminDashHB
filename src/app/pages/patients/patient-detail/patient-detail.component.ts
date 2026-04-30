import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions , EventClickArg, EventApi  } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { category, calendarEvents, createEventId } from '../../calendar/data';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ConsultantApiService } from '../../role/consultant/consultant-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../../contacts/contacts.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewPrescriptionComponent } from 'src/app/components/view-prescription/view-prescription.component';
import { ViewMedicalRecordComponent } from 'src/app/components/view-medical-record/view-medical-record.component';

@Component({
  standalone: false,
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {

  @ViewChild(ViewPrescriptionComponent) viewPrescriptionElem: ViewPrescriptionComponent;
  @ViewChild(ViewMedicalRecordComponent) viewMedicalRecordComponentElem: ViewMedicalRecordComponent;

  userId: string;
  pagination = {
    appointments: { page: 1, limit: 10, count: 0 },
    prescriptions: { page: 1, limit: 10, count: 0 },
    medicalRecords: { page: 1, limit: 10, count: 0 },
    payments: { page: 1, limit: 10, count: 0 },
  }
  page = 1
  pageSize = 5;
  count = 60;
  imgBase = environment.imageUrl;

  profile: any;
  appointments = []
  prescriptions = []
  medicalRecords = []
  payments = []
  vitals = []

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: '',
      center: 'prev,title,next',
      right: ''
    },
    initialEvents: calendarEvents,
    initialView: 'timeGridWeek',
    themeSystem: 'bootstrap',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // dateClick: this.openModal.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this),
    plugins: [dayGridPlugin, interactionPlugin],
  };

  constructor(
    private route: ActivatedRoute,
    private api: ConsultantApiService,
    private contactsService: ContactsService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
        this.userId = this.route.snapshot.params.id;
        this.getUserProfile()
        this.getAppointments()
        this.getPrescriptions()
        this.getMedicalrecord()
        this.getConsultationPayments()
    });
  }

  getUserProfile() {
    this.contactsService.getUserDetail(this.userId).subscribe(res => {
      let { success, data } = res
      if (success && data) {
        setTimeout(() => {
            this.profile = data;
            this.cdr.detectChanges();
        });
      } else {

      }
    }, (err: HttpErrorResponse) => {

    })
  }

  getAppointments() {
    let params = {
      page: this.pagination.appointments.page,
      limit: this.pagination.appointments.limit
    }
    this.spinner.show()
    this.api.getUserAppointments(this.userId, params).subscribe(res => {
      this.spinner.hide()
      let { success, data, total } = res;
      if (success && data) {
        setTimeout(() => {
            this.appointments = data
            this.pagination.appointments.count = total;
            this.cdr.detectChanges();
        });
      } else {

      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    })
  }

  getPrescriptions() {
    let params = {
      page: this.pagination.prescriptions.page,
      limit: this.pagination.prescriptions.limit
    }
    this.spinner.show()
    this.api.getUserPrescriptions(this.userId, params).subscribe(res => {
      this.spinner.hide()
      let { success, data, total } = res;
      if (success && data) {
        setTimeout(() => {
            this.prescriptions = data
            this.pagination.prescriptions.count = total;
            this.cdr.detectChanges();
        });
      } else {

      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    })
  }

  getMedicalrecord() {
    let params = {
      page: this.pagination.medicalRecords.page,
      limit: this.pagination.medicalRecords.limit
    }
    this.spinner.show()
    this.api.getUserMedicalrecord(this.userId, params).subscribe(res => {
      this.spinner.hide()
      let { success, data, count } = res;
      if (success && data) {
        setTimeout(() => {
            this.medicalRecords = data;
            this.pagination.medicalRecords.count = count;
            this.cdr.detectChanges();
        });
      } else {

      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    })
  }

  getConsultationPayments() {

    let params = {
      page: this.pagination.payments.page,
      limit: this.pagination.payments.limit
    }
    this.spinner.show()
    this.api.getUserConsultationPayments(this.userId, params).subscribe(res => {
      this.spinner.hide()
      let { success, data, total } = res;
      if (success && data) {
        setTimeout(() => {
            this.payments = data;
            this.pagination.payments.count = total;
            this.cdr.detectChanges();
        });
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    })
  }

  onViewPrescription(id) {
    if (this.viewPrescriptionElem) {
      this.viewPrescriptionElem.viewPrescription(id)
    }
  }

  onViewMedicalRecord(filepath){
    if(this.viewMedicalRecordComponentElem){
      this.viewMedicalRecordComponentElem.viewRecord(filepath)
    }
  }

  onChangetab() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100)
  }
  change(type) {
    if (type == 'appointments') {
      this.getAppointments()
    } else if (type == 'prescriptions') {
      this.getPrescriptions()
    } else if (type == 'medicalRecords') {
      this.getMedicalrecord()
    } else if (type == 'payments') {
      this.getConsultationPayments()
    }
  }
}
