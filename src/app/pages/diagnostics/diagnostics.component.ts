import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgForm, NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DiagnosticsService } from './diagnostics.service';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: false,
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent implements OnInit {

  breadCrumbItems: Array<{}> = [{ label: 'Diagnostics' }, { label: 'Bookings', active: true } ];
  term: any;
  searchProducts: Array<any> = [];
  filters = {
    search: '',
    type: '',
  }
  page = 1;
  pageSize = 10;
  list: any[] = [];
  total: number = 0;
  s3base = environment.imageUrl;
  modalData: any;

  constructor(
    private modalService: NgbModal,
    private toaster: ToastrService,
    private diagnostics: DiagnosticsService,
    private api: DiagnosticsService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.getList()
    });
  }

  getList() {
    let params: any = {
      limit: this.pageSize,
      page: this.page,
    }
    if (this.filters.search) params.keyword = this.filters.search;
    if (this.filters.type) params.type = this.filters.type;

    if (this.filters.search) {
      params.keyword = this.filters.search
    }

    this.spinner.show()
    this.diagnostics.searchProducts(params).subscribe(res => {
      this.spinner.hide()
      setTimeout(() => {
          res.data.forEach(product => {
            let childsGroup = {};
            product.childs.forEach(el => {
              let { groupName } = el;
              childsGroup[groupName] = childsGroup[groupName] || [];
              childsGroup[groupName].push(el)
            })
            product.childsGroup = Object.keys(childsGroup).map(key => {
              return {
                groupName: key,
                childs: childsGroup[key]
              }
            })
          })


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

  onDelete(id, index) {


  }

  onView(modalRef: any, data: any) {
    this.modalData = data;
    console.log(this.modalData);

    this.modalService.open(modalRef, { size: 'xl', windowClass: 'modal-holder' });

  }

  toggleFxn(data, type) {
    return new Observable((observer) => {
      let body: any = {};
      if (type == "isFeaturedOffer") {
        data.toggleFeaturedOfferLoading = true;
        body = {
          isFeaturedOffer: !data.isFeaturedOffer
        }
      }
      else if (type == "isFeaturedProduct") {
        data.toggleFeaturedProductoading = true;
        body = {
          isFeaturedProduct: !data.isFeaturedProduct
        }
      }

      this.api.updateProduct(data._id, body).subscribe((res) => {
        setTimeout(() => {
            if (type == "isFeaturedOffer") {
              data.isFeaturedOffer = !data.isFeaturedOffer;
              data.toggleFeaturedOfferLoading = false;
            }
            else if (type == "isFeaturedProduct") {
              data.isFeaturedProduct = !data.isFeaturedProduct;
              data.toggleFeaturedProductoading = false
            }
            this.cdr.detectChanges();
            observer.next(true);
        });
      }, (err: HttpErrorResponse) => {
        setTimeout(() => {
            if (type == "isFeaturedOffer") {
              data.toggleFeaturedOfferLoading = false;
            }
            else if (type == "isFeaturedProduct") {
              data.toggleFeaturedProductoading = false
            }
            this.cdr.detectChanges();
            observer.next(false);
        });
      }
      );

    });
  }

  onChangeType(type: NgModel) {
    console.log(type);
    this.page = 1;
    this.filters.type = type.value;
    this.getList();
  }

}
