import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgForm, NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DiagnosticsService } from './../diagnostics.service';
import { NgxSpinnerService } from 'ngx-spinner';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: 'app-diagnostic-bookings',
  templateUrl: './diagnostic-bookings.component.html',
  styleUrls: ['./diagnostic-bookings.component.scss']
})
export class DiagnosticBookingsComponent implements OnInit {

  breadCrumbItems: Array<{}> = [{ label: 'Diagnostics' }, { label: 'Bookings', active: true }];
  term: any;
  filters = {
    search: '',
    type: '',
  }
  searchProducts: Array<any> = [];
  page = 1;
  pageSize = 10;
  list: any[] = [];
  modalData: any;
  total: number = 0;
  s3base = environment.imageUrl;


  constructor(
    private modalService: NgbModal,
    private toaster: ToastrService,
    private diagnosticsService: DiagnosticsService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
        this.getList()
    });
  }

  getList() {
    let params: any = {
      limit: this.pageSize,
      page: this.page
    }

    if (this.filters.search) params.keyword = this.filters.search;
    if (this.filters.type) params.type = this.filters.type;
    this.spinner.show()
    this.diagnosticsService.getDiagnosticBookings(params).subscribe(res => {
      this.spinner.hide()
      setTimeout(() => {
          this.list = res.data;
          this.total = res.total;
          this.cdr.detectChanges();
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })


  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.getList();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  onSearch(form: NgForm) {
    this.filters.search = form.value.searchTerm.trim();
    this.page = 1;
    this.getList();
  }

  pageChanged() {
    this.getList();
  }

  onCancel(booking) {

  }

  onDelete(data, index) {
    if (confirm(`Are you sure you want to delete ${data.orderBy}'s booking?`)) {
      this.spinner.show()
      this.diagnosticsService.deleteBooking(data._id).subscribe(res => {
        this.spinner.hide()
        this.list.splice(index, 1)
        this.toaster.success('Booking deleted successfully')
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toaster.success(err.error?.message || 'Something went wrong!')
      });
    }

  }

  onView(modalRef: any, data: any) {
    this.modalData = data;
    this.diagnosticsService
    this.modalService.open(modalRef, { size: 'xl', windowClass: 'modal-holder' });

  }
  onChangeType(type: NgModel) {
    console.log(type);
    this.page = 1;
    this.filters.type = type.value;
    this.getList();
  }
}
