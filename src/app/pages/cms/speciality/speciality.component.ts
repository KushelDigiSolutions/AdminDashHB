import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EcommerceService } from '../../ecommerce/ecommerce.service';
import { NgbdSortableHeader, SortEvent } from '../../ecommerce/sortable-directive';
import { CmsService } from '../cms.service';
import { AddSpecialityComponent } from './add-speciality/add-speciality.component';


@Component({
  standalone: false,
  selector: 'app-speciality',
  templateUrl: './speciality.component.html',
  styleUrls: ['./speciality.component.scss']
})
export class SpecialityComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tempPageSize: any;
  tempsearchTerm: any;
  pageSize = 10;
  page = 1;
  search: string = '';

  dataArray = [];
  imgUrl = environment.imageUrl;

  childId;


  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private apiService: EcommerceService,
    private cmsService: CmsService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadCrumbItems = [{ label: 'Doctor' }, { label: 'Doctor Type', active: true }];

      this.childId = this.route.snapshot.params.id;
      this.childId
        ? this.fetchCategory()
        : this.getTypes();
    });
  }

  getTypes() {
    const url = `limit=${this.pageSize}&page=${this.page}`;
    this.apiService.getTypes(url).subscribe({
      next: (res: any) => {
        if (res.data) {
          setTimeout(() => {
            this.dataArray = res.data;
            this.cdr.detectChanges();
          });
        }
      },
      error: (err: any) => {
        console.log("err", err);
      }
    });
  }

  fetchCategory() {
    let url = `/detail ? _id=${this.childId}`;

    this.apiService.getCategoryList(url).subscribe({
      next: (res : any) => {
        setTimeout(() => {
          this.dataArray = res.data.children;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    }
    this.getTypes();
  }

  editType(id) {
    const data = {
      typeId: id
    }

    let modal = this.modalService.open(AddSpecialityComponent, { size: "lg" });

    modal.componentInstance.data = data;

    modal.result.then((result) => {
      if (result) {
        setTimeout(() => {
          this.getTypes();
          this.cdr.detectChanges();
        });
      }
    }).catch((err: any) => {
      console.log("err", err);
    })
  }

  removeType(data: any) {
    let { _id, name } = data
    if (confirm(`Are you sure you want to delete "${name}" category ? `)) {
      this.cmsService.removeType(_id).subscribe({
        next: (res : any) => {
          setTimeout(() => {
            this.toaster.success(res.message);
            this.getTypes();
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          this.toaster.error('Failed to remove speciality');
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

  toggleTop(data) {
    return new Observable((observer) => {
      console.log(data);
      data.toggleTopLoading = true;
      let body = {
        isTop: !data.isTop,
        _id: data._id
      }
      this.apiService.toggleCategoryTop(body).subscribe(res => {
        setTimeout(() => {
          data.toggleTopLoading = false;
          data.isTop = !data.isTop;
          this.cdr.detectChanges();
          observer.next(true)
        });
      }, error => {
        data.toggleTopLoading = false;
        observer.next(false)
      })
    });

  }

  toggleFeatured(data) {
    return new Observable((observer) => {
      console.log(data);
      data.toggleFeaturedLoading = true;
      let body = {
        isFeatured: !data.isFeatured,
        _id: data._id
      }
      this.apiService.toggleCategoryFeatured(body).subscribe(res => {
        setTimeout(() => {
          data.toggleFeaturedLoading = false;
          data.isFeatured = !data.isFeatured;
          this.cdr.detectChanges();
          observer.next(true)
        });
      }, error => {
        data.toggleFeaturedLoading = false;
        observer.next(false)
      })
    });

  }

  navigateToCategory(data) {
    this.router.navigate(['ecommerce/add-category'], { state: { data: data } });
  }

  addSpeciality() {
    const data = {
      path: 'add-doctor'
    }

    let modal = this.modalService.open(AddSpecialityComponent, { size: "lg" });

    modal.componentInstance.data = data;

    modal.result.then((result) => {
      if (result.data) {
        setTimeout(() => {
          this.getTypes();
          this.cdr.detectChanges();
        });
      }
    }).catch((err: any) => {
      console.log("err", err);
    })
  }

}