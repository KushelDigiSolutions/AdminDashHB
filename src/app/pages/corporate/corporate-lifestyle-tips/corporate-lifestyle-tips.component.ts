import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CorporateService } from '../corporate.service';
// import tempdata from './data-list';

@Component({
  standalone: false,
  selector: 'app-corporate-lifestyle-tips',
  templateUrl: './corporate-lifestyle-tips.component.html',
  styleUrls: ['./corporate-lifestyle-tips.component.scss']
})
export class CorporateLifestyleTipsComponent implements OnInit {
  breadcrumb = [
    { label: "Corporate" },
    { label: "Lifestyle Tips", active: true },
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
    this.corporateService.getLifestyleTipsList(params).subscribe((res: any) => {
      this.spinner.hide();
      setTimeout(() => {
          this.total$ = res.count || 0;
          this.list = res.data;
          this.cdr.detectChanges();
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });

  }

  remove(id) {
    let check = confirm('Are you sure you want to unlink lifestyle tip?')
    if (check) {
      this.spinner.show();
      this.corporateService.deleteLifestyleTip(id).subscribe(res => {
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
