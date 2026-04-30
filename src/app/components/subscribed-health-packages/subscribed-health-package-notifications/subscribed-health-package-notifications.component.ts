import { FullCalendarComponent } from '@fullcalendar/angular';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { CalendarOptions  } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';

import { notifications } from './notification-list';
import { getFormatedDate, weekdays } from 'src/app/util/date.util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { HealthPackagesService } from 'src/app/core/services/health-packages.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  standalone: false,
  selector: 'app-subscribed-health-package-notifications',
  templateUrl: './subscribed-health-package-notifications.component.html',
  styleUrls: ['./subscribed-health-package-notifications.component.scss']
})
export class SubscribedHealthPackageNotificationsComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('eventModal') eventModal: any;


  breadcrumb = [
    { label: "Home" },
    { label: "Subscribed Health Packages", active: true },
  ];

  events = [];
  draggable = Draggable;
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      center: "title",
      right: "prevYear,prev,next,nextYear" },
    initialEvents: [],
    themeSystem: "bootstrap",
    weekends: true,
    editable: true,
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
      let { start, _def } = val.event;
      let { publicId } = _def;
      this.notificationForm.patchValue({
        date: { year: start.getFullYear(), month: start.getMonth() + 1, day: start.getDate() },
        time: getFormatedDate(start, "hh:mm") })
      console.log(publicId, val);
      this.modalService.open(this.eventModal, {
        size: "lg",
        windowClass: "modal-holder",
        centered: true })
    },
    eventsSet: () => { },
    drop: (info) => {
      // let { id } = info.draggedEl;
      // console.log(id, info);
      // let notification = this.notifications.find(el => el._id == id);
      // this.events.push({
      //   id: notification._id,
      //   title: notification.title,
      //   start: info.date,
      //   className: 'bg-warning',
      // })
      // let calendarApi = this.calendarComponent.getApi();
      // calendarApi.refetchEvents();
    },
    plugins: [dayGridPlugin, interactionPlugin],
    datesSet: this.handleDateChanged.bind(this) };

  weekdays = weekdays;

  notifications = [];
  imageBase = environment.imageUrl;
  typesObj = this.notificationsService.types.concat(this.notificationsService.personalizedTypes).reduce((obj, noti) => { obj[noti.value] = noti.label; return obj; }, {});

  files = [];
  notificationForm: FormGroup = this.fb.group({
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
    repeat: [false],
    repeatData: this.fb.group({
      repeatType: ['daily'],
      every: [1],
      days: [],
      endType: ['never'],
      endDate: ['']
    }) });

  timeSlots = []
  notificationEdit = null
  notificationEditId = ''
  templateEditId = ''
  toggleDisableSubscription: Subscription;

  updateNotificationForm: FormGroup = this.fb.group({
    isDefaultNotification: [false],
    disableDefaultNotification: [true],
    notificationType: [''],
    templateId: [""],
    image: [[]],
    title: ["", [Validators.required]],
    message: ["", [Validators.required]],
    time: ["", [Validators.required]]
  });

  healthPackageId: string;
  healthPackageBuyId: string;
  url: string;
  total = 0;
  page: number = 1;
  limit: number = 10;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public notificationsService: NotificationsService,
    private spinner: NgxSpinnerService,
    private healthPackagesService: HealthPackagesService,
    public uploadService: FileUploadService,
    private toastr: ToastService,
  ) { }

  ngOnInit(): void {
    this.healthPackageId = this.route.snapshot.queryParams.healthPackageId;
    this.healthPackageBuyId = this.route.snapshot.params.id;
    this.url = this.router.url;
    this.timeSlots = this.notificationsService.getTimeSlots()
    console.log({ timeSlots: this.timeSlots });
    
    this.route.queryParams.subscribe(params => {
      this.page = parseInt(params.page) || 1
      this.limit = parseInt(params.limit) || 10
      this.getList()
    })
  }

  ngAfterViewInit(): void {
    // new Draggable(document.querySelector('#external-events'), {
    //   itemSelector: 'tr',
    //   eventData: (eventEl) => {
    //     let { id } = eventEl;
    //     let notification = this.notifications.find(el => el._id == id);

    //     return {
    //       id: notification._id,
    //       title: notification.title,
    //       className: notification.type == 'reminder' ? 'bg-success' : (notification.type == 'survey' ? 'bg-warning' : 'bg-primary')
    //     };
    //   }
    // });
    // this.modalService.open(this.eventModal, {
    //   size: "lg",
    //   windowClass: "modal-holder",
    //   centered: true,
    // })
  }

  handleDateChanged(arg) {
    let startDate = getFormatedDate(arg.startStr, "YYYY-MM-DD");
    let endDate = getFormatedDate(arg.endStr, "YYYY-MM-DD");
    // this.getAppointment();
  }

  openNotificationModal(modal) {
    this.modalService.open(modal, {
      size: "lg",
      windowClass: "modal-holder",
      centered: true });
  }

  deleteEvent() {
    let result = confirm('Are you sure you want to delete this notification event?')
    if (result) {

    }
  }

  getList() {
    let params = {
      page: this.page,
      limit: this.limit }
    this.spinner.show()
    this.healthPackagesService.getPersonlizedNotifications(this.healthPackageId, this.healthPackageBuyId, params).subscribe(res => {
      this.spinner.hide()
      let { success, data, total } = res;
      if (success) {
        data = this.mapDisabledProp(data)
        this.notifications = data
        this.total = total
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })
  }

  mapDisabledProp(data) {
    return data.map(el => {
      if (!el.healthPackageBuyId) el.healthPackageBuyId = [];
      if (this.notificationsService.types.map(el => el.value).includes(el.notificationType)) {
        el.canDelete = false;
        el.canEdit = true;
        el.disabled = el.healthPackageBuyId.includes(this.healthPackageBuyId);
      } else {
        el.canDelete = true;
        el.canEdit = true;
        el.disabled = !el.healthPackageBuyId.includes(this.healthPackageBuyId);
      }
      return el;
    })
  }

  checkDisableNotification(data) {
    return this.notificationsService.personalizedTypes.findIndex(el => el.value == data.notificationType) != -1
  }

  toggleFxn(data, type) {
    return new Observable((observer) => {
      let body: any = {};
      if (type == "disable") {
        data.toggleDisableLoading = true;
        let index = data.healthPackageBuyId.indexOf(this.healthPackageBuyId)
        body.healthPackageBuyId = [...data.healthPackageBuyId];
        if (index != -1) {
          body.healthPackageBuyId.splice(index, 1)
        } else {
          body.healthPackageBuyId.push(this.healthPackageBuyId)
        }

      }

      this.notificationsService.updateNotification(data._id, body).subscribe((res) => {
        if (type == "disable") {
          data.healthPackageBuyId = body.healthPackageBuyId;
          data.toggleDisableLoading = false;
        }
        this.notifications = this.mapDisabledProp(this.notifications)
        observer.next(true);
      }, (err: HttpErrorResponse) => {
        if (type == "disable") {
          data.toggleDisableLoading = false;
        }
        observer.next(false);
      }
      );

    });
  }

  onDelete(data, index: number) {
    let needConfirmation = false

    if (data.healthPackageBuyId.length) {
      if (!(data.healthPackageBuyId.length === 1 && data.healthPackageBuyId.includes(this.healthPackageBuyId))) {
        needConfirmation = true
      }
    }
    let msg = `Are you sure you want to delete "${data.templateId?.title}" notification?`;
    if (needConfirmation) msg = msg + ' This notification is being used for another health package subscription too. You can just disable it for this subscription.'
    if (confirm(msg)) {
      this.spinner.show()
      this.notificationsService.deleteNotification(data._id).subscribe(res => {
        this.spinner.hide()
        this.notifications.splice(index, 1)
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()

      })
    }
  }

  openEditNotificationModal(modal, data) {
    console.log(data);
    let { _id, templateId: template, time, healthPackageId } = data,
      { title, message, image, notificationType } = template;
    let isDefaultNotification = !template.healthPackageBuyId;

    notificationType = this.notificationsService.personalizedTypes.find(el => el.originalType = notificationType)?.value || null

    this.notificationEdit = data
    this.templateEditId = template._id
    this.notificationEditId = _id

    this.updateNotificationForm.patchValue({
      isDefaultNotification,
      notificationType,
      templateId: template._id,
      title,
      message,
      time,
      image: image ? [image] : []
    })
    this.modalService.open(modal, {
      size: "lg",
      windowClass: "modal-holder",
      centered: true });
  }

  onSubmitUpdateNotification() {
    let { invalid, value } = this.updateNotificationForm,
      { isDefaultNotification, disableDefaultNotification, image, title, message, time, notificationType } = value

    console.log(value);
    if (invalid) return;

    this.uploadService.smartFileUpload(image).subscribe(res => {
      let requestBody: any = {
        healthPackageId: this.healthPackageId,
        healthPackageBuyId: this.healthPackageBuyId,
        title,
        message,
        notificationType }
      if (this.healthPackageId) {
        value.healthPackageId = this.healthPackageId
      }

      let [imageId] = res.data;

      if (imageId) {
        requestBody.image = imageId
      }

      this.spinner.show()
      let req = this.notificationsService.createNotificationTemplate(requestBody);
      if (!isDefaultNotification && this.templateEditId) req = this.notificationsService.updateNotificationTemplate(this.templateEditId, requestBody);

      req.subscribe((res: any) => {

        this.toastr.success(`Template ${!isDefaultNotification && this.templateEditId ? 'updated' : 'created'} successfully`)
        let _id = !isDefaultNotification && this.templateEditId ? this.templateEditId : res.data._id;

        let notificationBody = {
          templateId: _id,
          time,
          healthPackageId: this.healthPackageId,
          healthPackageBuyId: [this.healthPackageBuyId]
        }

        let req = this.notificationsService.createNotification(notificationBody);
        if (!isDefaultNotification && this.notificationEditId) req = this.notificationsService.updateNotification(this.notificationEditId, notificationBody);
        req.subscribe(res => {
          this.toastr.success(`Notification ${!isDefaultNotification && this.notificationEditId ? 'updated' : 'created'} successfully`)

          if (isDefaultNotification && disableDefaultNotification) {
            this.toggleDisableSubscription = this.toggleFxn(this.notificationEdit, 'disable').subscribe(res => {
              this.toggleDisableSubscription.unsubscribe()
              this.spinner.hide()
              this.modalService.dismissAll()
              if (res) {
                this.toastr.success(`Original notification has been disabled successfully`)
              } else {
                this.toastr.error(`Unable to disable the original notification`)
              }
              this.getList()
            })
          } else {
            this.spinner.hide()
            this.modalService.dismissAll()
            this.getList()
          }
        }, (err: HttpErrorResponse) => {
          this.spinner.hide()
        })
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toastr.error(err.error?.message || 'Something went wrong!')
      });
    })

  }

  pageChanged() {
    this.router.navigate([], {
      queryParams: { ...this.route.snapshot.queryParams, limit: this.limit, page: this.page },
      relativeTo: this.route });
  }
}
