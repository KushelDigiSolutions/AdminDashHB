import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { HealthPackagesService } from 'src/app/core/services/health-packages.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  standalone: false,
  selector: 'app-subscribed-health-packages',
  templateUrl: './subscribed-health-packages.component.html',
  styleUrls: ['./subscribed-health-packages.component.scss']
})
export class SubscribedHealthPackagesComponent implements OnInit {

  breadcrumb = [
    { label: "Home" },
    { label: "Subscribed Packages", active: true },
  ];
  isAdmin = false;
  isHealthpackageEditor = false;
  total = 0;
  page: number = 1;
  limit: number = 10;

  list = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private healthPackagesService: HealthPackagesService,
    private authService: AuthenticationService,
    private toast: ToastService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUser().role.includes('Admin');
    this.isHealthpackageEditor = this.authService.currentUser().role.includes('HealthpackageEditor');
    this.route.queryParams.subscribe(params => {
      this.page = parseInt(params.page) || 1;
      this.limit = parseInt(params.limit) || 10
      this.getList()
    })
  }

  getList() {
    let params = {
      page: this.page,
      limit: this.limit
    }
    let req = this.healthPackagesService.getSubscribedPackagesforAdmin(params)
    if (!(this.isAdmin || this.isHealthpackageEditor)) req = this.healthPackagesService.getSubscribedPackagesforConsultant(params)

    req.subscribe(res => {
      let { success, data, total } = res
      if (success && data) {
        this.list = data;
        this.total = total
      }
    }, (err: HttpErrorResponse) => {

    })

  }

  onDelete(data: any, index: number) {
    if (confirm(`Are you sure you want to delete "${data.name}" subscription of "${data.user?.firstName} ${data.user?.lastName}"?`)) {
      this.spinner.show()
      this.healthPackagesService.deleteSubscription(data._id).subscribe(res => {
        this.spinner.hide()
        if (res.success) {
          this.toast.success('Subscription deleted successfully')
          this.list.splice(index, 1)
        }

      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toast.error(err.error?.message)
      })
    }
  }

  pageChanged() {
    this.router.navigate([], {
      queryParams: { limit: this.limit, page: this.page },
      relativeTo: this.route,
    });
  }

  changeValue(event, type) {

  }

}
