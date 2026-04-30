import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { DeleteModalComponent } from '../../consultation/modals/delete-modal/delete-modal.component';
import { DoctorsService } from '../doctors.service';
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: 'app-doctors-listing',
  templateUrl: './doctors-listing.component.html',
  styleUrls: ['./doctors-listing.component.scss']
})
export class DoctorsListingComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  user: User;
  search: string = '';
  pageSize = 10;
  page = 1;
  doctorArray: Array<{}>;
  count: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private doctorService: DoctorsService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.breadCrumbItems = [{ label: 'Consultancy' }, { label: 'Doctors', active: true }];
      this.user = this.authService.currentUser()
      this.route.queryParams.subscribe((res: any) => {
        setTimeout(() => {
          this.pageSize = res.limit ? parseInt(res.limit) : 10;
          this.page = res.page ? parseInt(res.page) : 1;
          this.getDoctorList();
        });
      });
    });
  }

  getDoctorList() {
    var url = `limit=${this.pageSize}&page=${this.page}`;
    if (this.search) {
      url += `&userIdentifier=${this.search}`
    }
    this.doctorService.getDoctorList(url)
      .subscribe((res: any) => {
        setTimeout(() => {
          console.log("data", res.data);
          this.count = res.count;
          this.doctorArray = res.data;
          this.cdr.detectChanges();
        });
      }, (err: HttpErrorResponse) => {
        console.log("err", err)
      })
  }

  changeValue() {
    this.getDoctorList();
  }

  toggleFxn(data) {
    return new Observable((observer) => {
      data.toggleActiveLoading = true;
      let body = {
        active: !data.active,
        _id: data._id
      }
      this.doctorService.updateDoctor(body).subscribe(res => {
        setTimeout(() => {
          data.toggleActiveLoading = false;
          data.active = !data.active;
          this.cdr.detectChanges();
          observer.next(true);
        });
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
        setTimeout(() => {
          data.toggleActivateLoading = false;
          data.activate = !data.activate;
          this.cdr.detectChanges();
          observer.next(true);
          this.toaster.success(res.message);
        });
      }, error => {
        data.toggleActivateLoading = false;
        observer.next(false)
      })
    });

  }

  toggleTopConsultant(data) {
    console.log("data", data);
    let body = {
      _id: data._id,
      isTopConsultant: !data.isTopConsultant
    }
    this.doctorService.updateDoctor(body).subscribe((res: any) => {
      setTimeout(() => {
        data.isTopConsultant = !data.isTopConsultant;
        this.toaster.success(res.message);
        this.cdr.detectChanges();
      });
    }, error => {

    })
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route
    });
    this.getDoctorList();
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

  removeDoctor(id) {

    const modalRef = this.modalService.open(DeleteModalComponent, { size: "lg" });

    modalRef.componentInstance.data = "consultant";

    modalRef.result.then(
      (result) => {
        if (result == "yes") {
          this.doctorService.removeConsultant(id).subscribe((res: any) => {
            setTimeout(() => {
              this.toaster.success(res.message);
              this.getDoctorList();
              this.cdr.detectChanges();
            });
          }, (err: HttpErrorResponse) => {
            this.toaster.error(err.error.message);
          })
        }
      },
      (reason) => {
        console.log("reason", reason);
      }
    );
  }

  showAction(type: string) {
    return true;
  }

  onSearch(form: NgForm) {
    this.search = (form.value.searchTerm || '').trim();
    this.page = 1;
    this.getDoctorList();
  }
}