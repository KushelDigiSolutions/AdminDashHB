import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AssessmentsService } from './assessments.service';

@Component({
  standalone: false,
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  breadCrumbItems: Array<{}> = [{ label: 'Assessments' }, { label: 'Create Assessment', active: true }];

  list: any[] = [];
  pageSize = 10;
  page = 1;
  count: number;

  constructor(
    private assessmentService: AssessmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.route.queryParams.subscribe((res: any) => {
        setTimeout(() => {
          this.pageSize = res.limit ? parseInt(res.limit) : 10;
          this.page = res.page ? parseInt(res.page) : 1;
          this.getList();
        });
      });
    });
  }

  getList() {
    this.spinner.show()
    this.assessmentService.getAssessmentsList().subscribe((res) => {
      this.spinner.hide()
      const { data, success, total } = res
      if (success) {
        setTimeout(() => {
          this.list = data
          this.count = total;
          this.cdr.detectChanges();
        });
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    })
  }

  onDelete(assessment, index) {
    if (confirm(`Are you sure you want to delete ${assessment.name}?`)) {
      this.spinner.show()
      this.assessmentService.deleteAssessment(assessment._id).subscribe(res => {
        this.getList();
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toaster.error(err.error?.message || 'Something went wrong!')
      })
    }
  }

  toggleFxn(data) {
    return new Observable((observer) => {
      data.toggleActiveLoading = true;
      let body = {
        active: !data.active,
        _id: data._id
      }
    });
  }

  changeValue() {
    this.getList();
  }

  change() {
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
  }
}
