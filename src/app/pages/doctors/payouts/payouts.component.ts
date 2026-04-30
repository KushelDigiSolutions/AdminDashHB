import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CmsService } from '../../cms/cms.service';
import { RemoveModalComponent } from '../../ecommerce/modals/remove/remove-modal/remove-modal.component';
import { NgbdSortableHeader, SortEvent } from '../../ecommerce/sortable-directive';
import { DoctorsService } from '../doctors.service';
import { getFormatedDate } from "src/app/util/date.util";

const FILTER_PAG_REGEX = /[^0-9]/g;


@Component({
  standalone: false,
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.scss']
})
export class PayoutsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  tempsearchTerm;
  count = 0;
  page = 1;
  pageSize = 10; 

  dataArray:Array<{}>;
  todayDate = new Date();
  minDate = this.getDatepickerFormat(this.todayDate);

  searchForm = this.fb.group({
    date: [this.minDate]
  });

  currentDate = new Date();
  maxDate = getFormatedDate(this.currentDate, "YYYY-MM-DD");

  recordsFG = this.fb.group({
    startDate: [
      getFormatedDate(
        new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),1),
        "YYYY-MM-DD"
      ),
      [Validators.required],
    ],
    endDate: [getFormatedDate(this.currentDate, "YYYY-MM-DD")],
  });

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private modal: NgbModal,
    private toaster: ToastrService,
    private doctorService: DoctorsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Payouts' }, { label: 'Payouts List', active: true }];
    this.getPayoutList();
  }

  getPayoutList(){
    this.doctorService.getPayoutsList().subscribe((res:any)=>{
      this.dataArray = res.data;
      this.count = res.count;
    }, (err:HttpErrorResponse)=>{})
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
    this.router.navigate([],{
      queryParams: {limit:this.pageSize,page:this.page},
      relativeTo: this.route
    });
    this.getPayoutList();  
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  change(){
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
    // this.getProductList();
  }

  onDateChange() {
    let { value } = this.searchForm;
    console.log(value.date);
    let date = this.changeDatepickerFormatToNormal(value.date);
    // this.populateDaySlots(date);
    // this.getAvailableTimeSlot(date)
  }

  changeDatepickerFormatToNormal(date: { year: number, month: number, day: number }): string {
    let clone: any = { ...date };
    clone.month = clone.month < 10 ? '0' + clone.month : clone.month;
    clone.day = clone.day < 10 ? '0' + clone.day : clone.day;
    return clone.year + '-' + clone.month + '-' + clone.day;
  }

  getDatepickerFormat(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }

  getRecords(){
    console.log("reco",this.recordsFG.value);
  }

}
