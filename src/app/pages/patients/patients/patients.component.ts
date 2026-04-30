import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UserService } from '../../contacts/userlist/user.service';
import { NgbdSortableHeader } from '../../contacts/userlist/sortable.directive';
import { environment } from 'src/environments/environment';
import { ContactsService } from '../../contacts/contacts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from '../../consultation/modals/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ConsultantApiService } from '../../role/consultant/consultant-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
  providers: [UserService, DecimalPipe]
})
export class PatientsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;
  search: string = '';
  searchProducts: Array<any> = [];
  page = 1;
  pageSize = 10;
  users$: any[];
  total$: number;
  s3base = environment.imageUrl;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public service: UserService,
    private contactService: ContactsService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private consultantService: ConsultantApiService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'User List', active: true }];
        this.getUSerList();
    });
  }

  getUSerList() {
    let data: any = {
      limit: this.pageSize,
      page: this.page,
    }
    this.spinner.show()
    if (this.search) {
      data.keyword = this.search;
      this.consultantService.getPatientsList(data).subscribe(res => {
        this.spinner.hide()
        setTimeout(() => {
            this.users$ = res.data;
            this.total$ = res.total;
            this.cdr.detectChanges();
        });
      }, ((err: HttpErrorResponse) => {
        this.spinner.hide()
      }));
    } else {
      this.consultantService.getPatientsList(data)
        .subscribe((res: any) => {
          this.spinner.hide()
          setTimeout(() => {
              this.users$ = res.data;
              this.total$ = res.total;
              this.cdr.detectChanges();
          });
        }, (err: any) => {
          this.spinner.hide()
        })
    }
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.getUSerList();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  onSearch(form: NgForm) {
    this.search = (form.value.searchTerm || '').trim();
    this.page = 1;
    this.getUSerList();
  }

  pageChanged() {
    this.getUSerList();
  }

  removeUser(id: string) {
    const modalRef = this.modalService.open(DeleteModalComponent, { size: "lg" });
    modalRef.componentInstance.data = "consultant";
    modalRef.result.then(
      (result) => {
        if (result == "yes") {
          this.contactService.deleteUser(id).subscribe((res: any) => {
            this.toaster.success(res.message);
            this.getUSerList();
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
}
