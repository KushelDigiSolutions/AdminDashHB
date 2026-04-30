import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DoctorsService } from '../doctors.service';
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: 'app-pending-doctor-request',
  templateUrl: './pending-doctor-request.component.html',
  styleUrls: ['./pending-doctor-request.component.scss']
})
export class PendingDoctorRequestComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  pageSize = 10;
  page = 1;
  doctorArray: Array<{}>;
  count: number = 0;
  search: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorsService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Consultancy' }, { label: 'Doctors', active: true }];

    this.route.queryParams.subscribe((res: any) => {
      this.pageSize = res.limit ? parseInt(res.limit) : 10;
      this.page = res.page ? parseInt(res.page) : 1;
      this.getDoctorRequestList();
    });

  }

  getDoctorRequestList() {
    var url = `limit=${this.pageSize}&page=${this.page}`;
    if (this.search) {
      url += `&userIdentifier=${this.search}`
    }
    this.doctorService.getPendingDoctorList(url)
      .subscribe((res: any) => {
        this.count = res.count;
        this.doctorArray = res.data
      }, (err: HttpErrorResponse) => {
        console.log("err", err)
      })
  }

  changeValue() {
    this.getDoctorRequestList();
  }

  toggleFxn(data) {
    return new Observable((observer) => {
      data.toggleActiveLoading = true;
      let body = {
        active: !data.active,
        _id: data._id
      }
      this.doctorService.updateDoctor(body).subscribe(res => {
        data.toggleActiveLoading = false;
        data.active = !data.active;
        observer.next(true)
      }, error => {
        data.toggleActiveLoading = false;
        observer.next(false)
      })
    });

  }

  toggleActivateFxn(data) {
    return new Observable((observer) => {
      data.toggleActivateLoading = true;
      let body = {
        activate: !data.activate,
        _id: data._id
      }
      this.doctorService.toggleUserAccount(body).subscribe((res: any) => {
        data.toggleActivateLoading = false;
        data.activate = !data.activate;
        observer.next(true);
        this.toaster.success(res.message);
      }, error => {
        data.toggleActivateLoading = false;
        observer.next(false)
      })
    });

  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route
    });
    this.getDoctorRequestList();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  change() {
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
  }

  onSearch(form: NgForm) {
    this.search = form.value.searchTerm.trim();
    this.page = 1;
    this.getDoctorRequestList();
  }

}
