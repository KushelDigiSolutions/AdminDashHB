import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbDate,
  NgbDatepickerNavigateEvent,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HealthPackagesService } from 'src/app/core/services/health-packages.service';
import { PathService } from 'src/app/core/services/path.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ChartType } from 'src/app/pages/chart/apex/apex.model';
import { environment } from 'src/environments/environment';
import {
  calculateAge,
  getFormatedDate,
  getTotalDaysInMonth,
  prependZero,
  time24to12,
} from 'src/app/util/date.util';
import { InsightsChartData } from './components/insights-chart/insights-chart.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-subscribed-health-package',
  templateUrl: './subscribed-health-package.component.html',
  styleUrls: ['./subscribed-health-package.component.scss'],
})
export class SubscribedHealthPackageComponent implements OnInit {
  breadcrumb = [{ label: 'Home' }, { label: 'Subscribed Package', active: true }];
  isConsultant: boolean;
  healthPackageBuyId: string;
  data: any;
  notificationsObj = {};
  notifications = [];

  imgBase = environment.imageUrl;
  userAppHost = environment.userAppHost;
  simplePieChart: ChartType = {
    chart: {
      height: 320,
      type: 'pie',
    },
    series: [25, 60],
    labels: ['Advice Followed', 'Advice Unfollowed'],
    colors: ['#34c38f', '#f46a6a', '#5b73e8', '#f1b44c'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: -10,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  activeTab = 'TabUserDetails';
  insightsCharts: InsightsChartData[] = [
    {
      title: 'SURVEY',
      chartData: [
        { label: 'Completed', labelValue: 0, value: 0 },
        { label: 'Total Surveys', labelValue: 0, value: 0 },
      ],
    },
    {
      title: 'ALERTS',
      chartData: [
        { label: 'Advice Followed', labelValue: 0, value: 0 },
        { label: 'Advice Unfollowed', labelValue: 0, value: 0 },
      ],
    },
    {
      title: 'APPOINTMENTS',
      chartData: [
        { label: 'Completed', labelValue: 0, value: 0 },
        { label: 'Total Appointments', labelValue: 0, value: 0 },
      ],
    },
    {
      title: 'LAB TESTS',
      chartData: [
        { label: 'Booked', labelValue: 0, value: 0 },
        { label: 'Total Tests', labelValue: 0, value: 0 },
      ],
    },
  ];

  date: NgbDateStruct;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private healthPackagesService: HealthPackagesService,
    private toast: ToastService,
    public pathService: PathService,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.healthPackageBuyId = this.route.snapshot.params.id;
    this.isConsultant = this.authService.currentUser().role.includes('Consultant');
    this.setCurrentDate();
    this.getDetails();
    this.getNotifications();
    console.log(this.route, this.router);
  }

  getDetails() {
    this.healthPackagesService.getSubscribedPackageDetail(this.healthPackageBuyId).subscribe(
      (res) => {
        let { success, data } = res;
        if (success) {
          let {
              usedAppointments,
              totalAppointments,
              testProducts,
              createdAt,
              expirayDate,
              insights,
            } = data,
            totalTests = testProducts.length,
            bookedTests = testProducts.filter((test) => test.diagnosticBookingId).length;

          data.bookedTests = bookedTests;

          this.insightsCharts[0].chartData[0].value = insights.totalAnswers;
          this.insightsCharts[0].chartData[1].value =
            insights.totalSurveyNotifications - insights.totalAnswers;

          this.insightsCharts[0].chartData[0].labelValue = insights.totalAnswers;
          this.insightsCharts[0].chartData[1].labelValue = insights.totalSurveyNotifications;

          this.insightsCharts[1].chartData[0].value = insights.yesAnswers;
          this.insightsCharts[1].chartData[1].value = insights.noAnswers;

          this.insightsCharts[1].chartData[0].labelValue = insights.yesAnswers;
          this.insightsCharts[1].chartData[1].labelValue = insights.noAnswers;

          this.insightsCharts[2].chartData[0].value = usedAppointments;
          this.insightsCharts[2].chartData[1].value = totalAppointments - usedAppointments;

          this.insightsCharts[2].chartData[0].labelValue = usedAppointments;
          this.insightsCharts[2].chartData[1].labelValue = totalAppointments;

          this.insightsCharts[3].chartData[0].value = bookedTests;
          this.insightsCharts[3].chartData[1].value = totalTests - bookedTests;
          this.insightsCharts[3].chartData[0].labelValue = bookedTests;
          this.insightsCharts[3].chartData[1].labelValue = totalTests;

          let startDate = new Date(createdAt).getTime(),
            endDate = new Date(expirayDate).getTime(),
            totalTime = endDate - startDate,
            currentTime = new Date().getTime(),
            timePassed = endDate - currentTime,
            expirationProgress = 100 - (timePassed / totalTime) * 100;
          console.log({ expirationProgress });
          if (expirationProgress > 100) expirationProgress = 100;

          data.expirationProgress = expirationProgress.toFixed(2);
          this.data = data;
          this.cdr.markForCheck();
        }
      },
      (err: HttpErrorResponse) => {
        if (err.status == 404) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
          this.toast.error('Subscription not found!');
        } else {
          this.toast.error(err.error?.message);
        }
      },
    );
  }

  formatNgbDate(date?: NgbDateStruct) {
    let { day, month, year } = date || this.date;
    return `${year}-${prependZero(month)}-${prependZero(day)}`;
  }

  setCurrentDate() {
    let date = new Date();
    this.date = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  getNotifications(fromDate?: string, toDate?: string) {
    let date = new Date();

    date.setDate(1);
    fromDate = fromDate || getFormatedDate(date);

    date.setDate(getTotalDaysInMonth(date));
    toDate = toDate || getFormatedDate(date);

    if (this.notificationsObj[fromDate] && this.notificationsObj[toDate]) return;

    this.spinner.show();
    this.healthPackagesService
      .getNotifications(this.healthPackageBuyId, fromDate, toDate)
      .subscribe(
        (res) => {
          this.spinner.hide();

          let { success, data } = res;

          if (success) {
            this.notificationsObj = { ...this.notificationsObj, ...data };
            this.setNotifications();
          }
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
        },
      );
  }

  setNotifications() {
    let selectedDate = this.formatNgbDate();
    this.notifications = this.notificationsObj[selectedDate] || [];
  }

  onDateSelect(date) {
    console.log(date);
    this.setNotifications();
  }

  onNavigate(event: NgbDatepickerNavigateEvent) {
    console.log(event);
    if (event?.next) {
      let { month, year } = event.next;
      let fromDate = this.formatNgbDate({ month, year, day: 1 });
      let toDate = new Date(fromDate);
      let totalDays = getTotalDaysInMonth(fromDate);
      toDate.setDate(totalDays);

      this.getNotifications(fromDate, getFormatedDate(toDate));
    }
  }

  onSelectImage(event) {}
  onRemoveImage(e) {}

  calculateAge(date) {
    return calculateAge(date);
  }

  onChangeTab(event) {
    this.activeTab = event;
  }

  format24to12(time) {
    return time24to12(time);
  }
}
