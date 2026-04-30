import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ConsultationService } from "../consultation.service";
import { DeleteModalComponent } from "../modals/delete-modal/delete-modal.component";

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: "app-appointment",
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.scss"],
})
export class AppointmentComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  appointments = [];
  total$;
  page: number;
  pageSize: number;

  constructor(
    private apiService: ConsultationService,
    private modal: NgbModal,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.breadCrumbItems = [
        { label: "Contacts" },
        { label: "Appointments", active: true },
      ];

      this.route.queryParams.subscribe((res: any) => {
        setTimeout(() => {
          console.log("res", res);
          this.pageSize = res.limit ? parseInt(res.limit) : 10;
          this.page = res.page ? parseInt(res.page) : 1;
          this.getAppointment();
        });
      });
    });
  }

  getAppointment() {
    const url = `limit=${this.pageSize}&page=${this.page}`;
    let userRole = JSON.parse(localStorage.getItem('hbDashboardUser'));
    let consultantUser = userRole.role.find(x=>x=="Consultant");

    (consultantUser?this.apiService.getConsultantAppointment(url):this.apiService.getAppointmentList(url))
    .subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.appointments = res.data.appointments;
          this.total$ = res.data.noOfAppointments;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error("Failed to load appointments", err);
      }
    });

  }

  cancelAppointment(id) {
    const modalRef = this.modal.open(DeleteModalComponent, { size: "lg" });

    modalRef.componentInstance.data = "cancelAppointment";

    modalRef.result.then(
      (result) => {
        if (result == "yes") {
          this.apiService
            .cancelAppointment({ _id: id })
            .subscribe({
              next: (res: any) => {
                setTimeout(() => {
                  this.getAppointment();
                  this.cdr.detectChanges();
                });
              },
              error: (err: any) => {
                this.toaster.error("Please try again later");
              }
            });
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
          this.apiService.removeAppointment(id).subscribe({
            next: (res: any) => {
              setTimeout(() => {
                this.getAppointment();
                this.cdr.detectChanges();
              });
            },
            error: (err: any) => {
              this.toaster.error("Please try again later");
            }
          });
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
