import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  breadcrumb = [
    { label: "Home" },
    { label: "Notifications", active: true },
  ];
  imageBase = environment.imageUrl;
  search = '';
  total = 0;
  page: number = 1;
  limit: number = 10;

  notifications = [
    { title: 'Drink Water', body: 'Take one glass (500ml) of lukewarm water', image: '/assets/images/users/avatar-5.jpg', status: 'active' }
  ];

  typesObj = this.notificationsService.types.concat(this.notificationsService.personalizedTypes).reduce((obj, noti) => { obj[noti.value] = noti.label; return obj; }, {});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private taost: ToastService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any) => {
      this.limit = res.limit ? parseInt(res.limit) : 10;
      this.page = res.page ? parseInt(res.page) : 1;
      this.getList();
    });
  }

  getList() {
    let data: any = {
      page: this.page,
      limit: this.limit,
    }

    if (this.search) data.keyword = this.search;
    this.spinner.show()
    this.notificationsService.getNotifications(data).subscribe(res => {
      this.spinner.hide()
      let { success, data, total } = res;
      if (success) {
        this.total = total
        this.notifications = data
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })
  }

  delete(data: any, index: number) {
    if (confirm(`Are you sure you want to delete "${data.templateId?.title}" notification?`)) {
      this.spinner.show()
      this.notificationsService.deleteNotification(data._id).subscribe(res => {
        this.spinner.hide()
        this.getList()
        this.taost.success('Notification deleted successfully')
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.taost.error(err.error?.message)
      })
    }
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.limit, page: this.page },
      relativeTo: this.route,
    });
    // this.getAppointment();
  }

  pageChanged() {
    this.router.navigate([], {
      queryParams: { limit: this.limit, page: this.page },
      relativeTo: this.route,
    });
  }

  onSearch(form: NgForm) {
    this.search = form.value.searchTerm.trim();
    this.page = 1;
    this.getList();
  }

  changeLimit() {
    this.selectPage('1')
  }

}
