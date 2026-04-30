import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RemoveModalComponent } from '../../ecommerce/modals/remove/remove-modal/remove-modal.component';
import { NgbdSortableHeader, SortEvent } from '../../ecommerce/sortable-directive';
import { DoctorsService } from '../doctors.service';
import { currentDate, getFormatedDate } from "src/app/util/date.util";
import { NgxSpinnerService } from 'ngx-spinner';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: 'app-earning-list',
  templateUrl: './earning-list.component.html',
  styleUrls: ['./earning-list.component.scss']
})
export class EarningListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  tempsearchTerm;
  count = 0;
  page = 1;
  pageSize = 10;

  dataArray: Array<{}>;
  todayDate = new Date();
  minDate = this.getDatepickerFormat(this.todayDate);

  searchForm = this.fb.group({
    date: [this.minDate]
  });

  currentDate = new Date();
  maxDate = getFormatedDate(new Date().setDate(new Date().getDate() + 1), "YYYY-MM-DD");

  recordsFG = this.fb.group({
    startDate: [
      getFormatedDate(
        new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
        "YYYY-MM-DD"
      ),
      [Validators.required],
    ],
    endDate: [getFormatedDate(this.currentDate, "YYYY-MM-DD")],
  });

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private modal: NgbModal,
    private toaster: ToastrService,
    private doctorService: DoctorsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Payouts' }, { label: 'Payouts List', active: true }];
    this.route.queryParams.subscribe((res: any) => {
      console.log("res", res);
      this.pageSize = res.limit ? parseInt(res.limit) : 10;
      this.page = res.page ? parseInt(res.page) : 1;
      this.getEarningList();
    });
  }

  getEarningList() {
    let { startDate, endDate } = this.recordsFG.value;
    let params = {
      limit: this.pageSize,
      page: this.page,
      startDate,
      endDate
    }

    this.spinner.show();
    this.doctorService.getEarningList(params).subscribe((res: any) => {
      this.spinner.hide();
      this.dataArray = res.data;
      this.count = res.count;
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    })
  }

  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route
    });
    this.getEarningList();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  change() {
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
    // this.getEarningList();
  }

  getDatepickerFormat(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }

  getRecords() {
    this.page = 1;
    this.getEarningList();
  }

}
