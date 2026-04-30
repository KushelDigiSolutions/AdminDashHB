import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConsultationService } from '../../consultation/consultation.service';
import { DeleteModalComponent } from '../../consultation/modals/delete-modal/delete-modal.component';
import { DoctorsService } from '../doctors.service';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: 'app-doctor-appointment-tab',
  templateUrl: './doctor-appointment-tab.component.html',
  styleUrls: ['./doctor-appointment-tab.component.scss']
})
export class DoctorAppointmentTabComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  appointments = [];
  total$;
  page: number;
  pageSize: number;

  @Input() consultantId:string;

  constructor(
    private apiService: ConsultationService,
    private modal: NgbModal,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorsService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Contacts" },
      { label: "Appointments", active: true },
    ];

    console.log("edit Id doctor",this.consultantId);

    this.route.queryParams.subscribe((res: any) => {
      this.pageSize = res.limit ? parseInt(res.limit) : 10;
      this.page = res.page ? parseInt(res.page) : 1;
      this.getAppointment();
    });
  }

  getAppointment() {
    const url = `limit=${this.pageSize}&page=${this.page}`;
    this.doctorService.getDoctorAppointments(url,this.consultantId).subscribe((res: any) => {
      this.appointments = res.data.appointments;
      this.total$ = res.data.noOfAppointments;
    }),
      (err: any) => {};
  }

  cancelAppointment(id) {
    const modalRef = this.modal.open(DeleteModalComponent, { size: "lg" });

    modalRef.componentInstance.data = "cancelAppointment";

    modalRef.result.then(
      (result) => {
        if (result == "yes") {
          this.apiService
            .cancelAppointment({ _id: id })
            .subscribe((res: any) => {
              this.getAppointment();
            }),
            (err: any) => {
              this.toaster.error("Please try again later");
            };
        }
      },
      (reason) => {
        console.log("reason", reason);
      }
    );
  }

  removeAppointment(id) {
    const modalRef = this.modal.open(DeleteModalComponent, { size: "lg" });

    modalRef.componentInstance.data = "appointment";

    modalRef.result.then(
      (result) => {
        if (result == "yes") {
          this.apiService.removeAppointment(id).subscribe((res: any) => {
            this.getAppointment();
          }),
            (err: any) => {
              this.toaster.error("Please try again later");
            };
        }
      },
      (reason) => {
        console.log("reason", reason);
      }
    );
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
    this.getAppointment();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, "");
  }

  pageChanged() {
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route,
    });
  }
}
