import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CorporateService } from '../corporate.service';

@Component({
  standalone: false,
  selector: 'app-corporate-packages',
  templateUrl: './corporate-packages.component.html',
  styleUrls: ['./corporate-packages.component.scss']
})
export class CorporatePackagesComponent implements OnInit {
  breadcrumb = [
    { label: "Corporate" },
    { label: "Packages", active: true },
  ];

  list = [];
  total$ = 0;
  page = 1;
  pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private corporateService: CorporateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
        this.route.queryParams.subscribe((res: any) => {
          setTimeout(() => {
              console.log("res", res);
              this.pageSize = res.limit ? parseInt(res.limit) : 10;
              this.page = res.page ? parseInt(res.page) : 1;
              this.getList();
          });
        });
    });
  }

  getList() {
    let params = {
      limit: this.pageSize,
      page: this.page
    }
    this.spinner.show();
    this.corporateService.getCorporatePackagesList(params).subscribe((res: any) => {
      this.spinner.hide();
      setTimeout(() => {
          this.list = res.data;
          this.cdr.detectChanges();
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });

  }

  remove(id) {
    let check = confirm('Are you sure you want to delete this package?')
    if (check) {
      this.spinner.show();
      this.corporateService.deleteCorporatePackage(id).subscribe(res => {
        this.spinner.hide();
        this.toastr.success('Package deleted successfully')
        this.getList();
      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.success(err.error?.message || 'Something went wrong');
      })
    }
  }

  changeValue() {
    this.pageChanged();
  }

  pageChanged() {
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
  }
}
