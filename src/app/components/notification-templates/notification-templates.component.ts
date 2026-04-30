import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-notification-templates',
  templateUrl: './notification-templates.component.html',
  styleUrls: ['./notification-templates.component.scss']
})
export class NotificationTemplatesComponent implements OnInit {

  breadcrumb = [
    { label: "Home" },
    { label: "Notifications" },
    { label: "Templates", active: true },
  ];
  search = '';
  total = 0;
  page: number = 1;
  limit: number = 10;
  templates = [];
  imgBase = environment.imageUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.route.snapshot.queryParams
    this.route.queryParams.subscribe(params => {
      let { page, limit } = params
      this.limit = limit ? parseInt(limit) : 10;
      this.page = page ? parseInt(page) : 1;

      this.getList();
    })
  }

  getList() {
    let params: any = {
      page: this.page,
      limit: this.limit,
    }
    if (this.search) params.keyword = this.search;

    this.spinner.show()
    this.notificationsService.getNotificationTemplates(params).subscribe(res => {
      this.spinner.hide()
      let { data, success, total } = res;
      if (success) {
        this.templates = res.data
        this.total = total;
        this.templates = data
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })
  }

  onDelete(data, index) {
    if (confirm(`Are you sure you want yo delete ${data.title} template?`)) {
      this.spinner.show()
      this.notificationsService.deleteNotificationTemplate(data._id).subscribe(res => {
        this.spinner.hide()
        this.toastr.success('Template deleted successfully');
        this.getList();
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toastr.error(err.error?.message || 'Something went wrong!')
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
