import { FullCalendarComponent } from '@fullcalendar/angular';
import { Component, NgZone, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CalendarOptions ,
  EventClickArg,
  EventApi,
   } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { category, calendarEvents, createEventId } from "./data";

import { ConsultationService } from "src/app/pages/consultation/consultation.service";
import { ConsultantApiService } from "../consultant-api.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { getFormatedDate } from "src/app/util/date.util";
import { NgxSpinnerService } from "ngx-spinner";
import { User } from "src/app/core/models/auth.models";
import { EcommerceService } from "src/app/pages/ecommerce/ecommerce.service";
import { HttpErrorResponse } from "@angular/common/http";

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: "app-consultant-appointments",
  templateUrl: "./consultant-appointments.component.html",
  styleUrls: ["./consultant-appointments.component.scss"] })
export class ConsultantAppointmentsComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  breadCrumbItems = [
    { label: "Home" },
    { label: "Appointments", active: true },
  ];
  user: User;
  isUserVerified: -1 | 0 | 1 = -1;
  appointments = [];
  total$;
  page: number;
  pageSize: number;

  startDate: any = getFormatedDate(new Date());
  endDate: any = getFormatedDate(new Date());

  selectedView: "list" | "calendar" = "list";
  events = [];
  calendarOptions: CalendarOptions = {
    // initialView: 'timeGridWeek',
    headerToolbar: {
      left: "dayGridMonth,timeGridWeek,timeGridDay",
      center: "title",
      right: "prevYear,prev,next,nextYear" },
    initialEvents: [],
    themeSystem: "bootstrap",
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short'
    },
    events: (val, callback) => {
      callback(this.events)
    },
    dateClick: () => { },
    eventClick: (val) => {
      let { publicId } = val.event._def;
      let appt = this.appointments.find(el => el._id == publicId);
      let params = { view: 'followUp' };

      this.router.navigate(["/", "consultant", "appointments", appt.parentAppointmentId || publicId], { queryParams: appt.parentAppointmentId ? params : {} });
    },
    eventsSet: () => { },
    plugins: [dayGridPlugin, interactionPlugin],
    datesSet: this.handleDateChanged.bind(this) };

  constructor(
    private authService: AuthenticationService,
    private apiService: ConsultationService,
    private eCommerceService: EcommerceService,
    private api: ConsultantApiService,
    private modal: NgbModal,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.breadCrumbItems = [
        { label: "Contacts" },
        { label: "Appointments", active: true },
      ];
      this.user = this.authService.currentUser();
      this.getProfile();
    });
  }

  getProfile() {
    this.spinner.show()
    this.api.getProfile().subscribe((res: any) => {
      this.spinner.hide();
      setTimeout(() => {
        this.isUserVerified = res.data.activate ? 1 : 0;
        this.cdr.detectChanges();

        if (this.isUserVerified) {
          this.selectedView = this.route.snapshot.queryParams.view || this.selectedView;
          this.route.queryParams.subscribe((res: any) => {
            setTimeout(() => {
              this.pageSize = res.limit ? parseInt(res.limit) : 10;
              this.page = res.page ? parseInt(res.page) : 1;
              this.getAppointment();
            });
          });
        }
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }

  getAppointment() {
    if (this.isUserVerified != 1) return;
    const url = this.selectedView == "list"
      ? `limit=${this.pageSize}&page=${this.page}&consultantId=${this.user._id}`
      : `startDate=${this.startDate}&endDate=${this.endDate}&consultantId=${this.user._id}`;
    this.spinner.show();
    this.apiService
      .getAppointmentList(url)
      .subscribe((res: any) => {
        this.spinner.hide();
        setTimeout(() => {
          this.appointments = res.data.appointments;
          this.total$ = res.data.noOfAppointments;
          this.page = this.route.snapshot.queryParams.page || 1;
          console.log("Calendar options 0", this.calendarOptions);
          if (this.selectedView == 'calendar') {
            let events = this.appointments.map((appt) => {

              let [startTimeSlot, endTimeSlot] = appt.primaryTimeSlot.split("-").map(el => el.trim());
              let start = new Date(appt.date);
              start.setHours(startTimeSlot.split(':')[0], startTimeSlot.split(':')[1]);

              let end = new Date(appt.date);
              end.setHours(endTimeSlot.split(':')[0], endTimeSlot.split(':')[1]);

              let className = '';
              switch (appt.status) {
                case 'Confirmed': case 'Re-scheduled': className = 'bg-success'; break;
                case 'Payment-Awaited': className = 'bg-warning'; break;
                case 'Completed': className = 'bg-secondary'; break;
                case 'Cancelled': className = 'bg-danger'; break;
                default: className = 'bg-primary';
              }

              if (appt.fee && appt.paymentStatus != 'accepted' && (appt.status == 'Confirmed' || appt.status == 'Re-scheduled')) {
                className = 'bg-warning';
              }

              return {
                id: appt._id,
                title: appt.userId?.firstName || 'Hb User',
                start: new Date(start),
                // end: new Date(end),
                className };
            });
            this.events = events;
            let calendarApi = this.calendarComponent.getApi();
            calendarApi.refetchEvents();
          }

          console.log("Caledar Options", this.calendarOptions);
          this.cdr.detectChanges();
        });
      }),
      (err: any) => {
        this.spinner.show();
      };
  }

  handleDateChanged(arg) {
    this.startDate = getFormatedDate(arg.startStr, "YYYY-MM-DD");
    this.endDate = getFormatedDate(arg.endStr, "YYYY-MM-DD");
    this.getAppointment();
  }

  changeValue(event, type) {
    this.getAppointment();
  }

  cancelAppointment(id) { }

  removeAppointment(id) { }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route });
    this.getAppointment();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, "");
  }

  pageChanged(page: number) {
    this.page = page;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route });
  }
  onChangeView(type) {
    this.selectedView = type;
    this.router.navigate([], { queryParams: { view: type }, replaceUrl: true })
    if (type == 'list') this.getAppointment();
  }
}
