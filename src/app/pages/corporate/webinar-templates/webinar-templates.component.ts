import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CorporateService } from '../corporate.service';

@Component({
  standalone: false,
  selector: 'app-webinars-template',
  templateUrl: './webinar-templates.component.html',
  styleUrls: ['./webinar-templates.component.scss']
})
export class WebinarTemplatesComponent implements OnInit {
  breadcrumb = [
    { label: "Corporate" },
    { label: "Webinars", active: true },
  ];

  list = [];
  total = 0;
  page = 1;
  pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private corporateService: CorporateService,
    private spinner: NgxSpinnerService,
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
    this.corporateService.getWebinarList(params).subscribe((res: any) => {
      this.spinner.hide();
      setTimeout(() => {
          this.total = res.count;
          this.list = res.data;
          this.cdr.detectChanges();
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });

  }

  remove(id) {
    let check = confirm('Are you sure you want to delete this company?')
    if (check) {
      this.spinner.show();
      this.corporateService.deleteWebinar(id).subscribe(res => {
        this.spinner.hide();
        this.getList();
      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
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
