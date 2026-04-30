import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgbdSortableHeader, SortEvent } from '../../ecommerce/sortable-directive';
import { DoctorsService } from '../doctors.service';
import { AddSpecializationComponent } from './add-specialization/add-specialization.component';

@Component({
  standalone: false,
  selector: 'app-consultant-specialization',
  templateUrl: './consultant-specialization.component.html',
  styleUrls: ['./consultant-specialization.component.scss']
})
export class ConsultantSpecializationComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tempPageSize: any;
  tempsearchTerm: any;
  pageSize = 10;
  page = 1;
  total = 0;
  search: string = '';

  dataArray = [];
  imgUrl = environment.imageUrl;

  childId;


  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private doctorService: DoctorsService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadCrumbItems = [{ label: 'Doctor' }, { label: 'Doctor Specializations', active: true }];
      this.getSpecializationList();
    });
  }

  getSpecializationList() {
    const url = `limit=${this.pageSize}&page=${this.page}`;
    this.spinner.show()
    this.doctorService.getSpecializationList(url).subscribe((res: any) => {
      this.spinner.hide()
      if (res.success) {
        setTimeout(() => {
          window.scroll(0, 0);
          this.total = res.data.total;
          this.dataArray = res.data.healthSpeciality;
          this.cdr.detectChanges();
        });
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      console.log("err", err);
    })

  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    }
    this.getSpecializationList();
  }

  editSpecialization(id) {
    const data = {
      typeId: id
    }

    let modal = this.modalService.open(AddSpecializationComponent, { size: "lg" });

    modal.componentInstance.data = data;

    modal.result.then((result) => {
      if (result) {
        setTimeout(() => {
          this.getSpecializationList();
          this.cdr.detectChanges();
        });
      }
    }).catch((err: any) => {
      console.log("err", err);
    })
  }

  removeSpecialization(id) {
    if (confirm('Are you sure you want to delete this specialization ? ')) {
      this.spinner.show();
      this.doctorService.deleteSpecialization(id).subscribe({
        next: (res : any) => {
          setTimeout(() => {
            this.spinner.hide();
            this.toaster.success(res.message);
            this.getSpecializationList();
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
           this.spinner.hide();
           this.toaster.error('Failed to delete specialization');
        }
      });
    }
  }

  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

  }

  addSpeciality() {
    const data = {
      path: 'add-doctor'
    }

    let modal = this.modalService.open(AddSpecializationComponent, { size: "lg" });

    modal.componentInstance.data = data;

    modal.result.then((result) => {
      if (result.data) {
        setTimeout(() => {
          this.getSpecializationList();
          this.cdr.detectChanges();
        });
      }
    }).catch((err: any) => {
      console.log("err", err);
    })
  }

}