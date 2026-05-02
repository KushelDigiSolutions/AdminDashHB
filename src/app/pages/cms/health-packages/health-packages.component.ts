import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserRole } from 'src/app/util/user-role.util';
import { EcommerceService } from '../../ecommerce/ecommerce.service';

@Component({
  standalone: false,
  selector: 'app-health-packages',
  templateUrl: './health-packages.component.html',
  styleUrls: ['./health-packages.component.scss']
})
export class HealthPackagesComponent implements OnInit {

  breadCrumbItems = [
    { label: "CMS" },
    { label: "Health Packages", active: true },
  ];
  list = [];
  total = 0;
  page = 1;
  pageSize = 10;
  isAdmin = false;
  isHealthpackageEditor = false;

  constructor(
    private api: ApiService,
    private eCommerceService: EcommerceService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUser().role.includes('Admin');
    this.isHealthpackageEditor = this.authService.currentUser().role.includes('HealthpackageEditor');

    this.route.queryParams.subscribe((res: any) => {
      console.log("res", res);
      this.pageSize = res.limit ? parseInt(res.limit) : 10;
      this.page = res.page ? parseInt(res.page) : 1;
      this.getList();
    });
  }

  getList() {
    let params = {
      isAdmin: true,
      limit: this.pageSize,
      page: this.page
    }
    this.spinner.show()
    this.api.get((this.isAdmin || this.isHealthpackageEditor) ? 'healthPackages' : 'healthPackages/consultant', params).subscribe((res: any) => {
      this.spinner.hide()
      setTimeout(() => {
        this.list = res.data;
        this.total = res.total;
        this.cdr.detectChanges();
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    });

  }

  onDelete(data, index) {
    let check = confirm('Are you sure you want to delete this package?')
    if (check) {
      this.api.delete('healthPackages/' + data._id).subscribe(res => {
        this.getList();
      })
    }
  }

  pageChanged() {
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
  }

  canShow() {
    return !!(['Admin'] as UserRole[]).find(role => this.authService.currentUser().role.includes(role))
  }

  toggleFxn(data, type) {
    return new Observable((observer) => {
      let body: any = {};
      if (type == "isPopular") {
        data.toggleIsPopularLoading = true;
        body = {
          isPopular: !data.isPopular
        }
      } else if (type == "active") {
        data.toggleActiveLoading = true;
        body = {
          active: !data.active
        }
      } else if (type == "published") {
        data.togglePublishLoading = true;
        body = {
          published: !data.published
        }
      }
      else return;

      this.eCommerceService.updateHealthPackage(data._id, body).subscribe((res) => {
        if (type == "isPopular") {
          data.isPopular = !data.isPopular;
          data.toggleIsPopularLoading = false;
        } else if (type == "active") {
          data.active = !data.active;
          data.toggleActiveLoading = false;
        } else if (type == "published") {
          data.published = !data.published;
          data.togglePublishLoading = false;
        }
        observer.next(true);
      }, (err: HttpErrorResponse) => {
        if (type == "isPopular") {
          data.toggleIsPopularLoading = false;
        } else if (type == "active") {
          data.toggleActiveLoading = false;
        } else if (type == "published") {
          data.togglePublishLoading = false;
        }
        observer.next(false);
      }
      );

    });
  }

}
