import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgModel, NgForm, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule, NgbDatepickerModule, NgbModalModule, NgbModal, NgbActiveModal, NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../shared/ui/ui.module';
import { EcommerceService } from '../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { TransactionService } from '../orders/transaction.service';
import { Transaction } from '../orders/transaction';
import { NgbdSortableHeader, SortEvent } from '../sortable-directive';
import { productList, productModel } from '../product.model';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CsvService } from '../../../core/services/csv.service';
import { HbSwitchComponent } from '../../../shared/ui/hb-switch/hb-switch.component';
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    UIModule,
    NgSelectModule,
    DropzoneModule,
    NgbModalModule,
    NgbdSortableHeader,
    HbSwitchComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-products',
  templateUrl: './products.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./products.component.scss'],
  providers: [TransactionService, DecimalPipe]
})
export class ProductsComponent implements OnInit {

  search: string = '';
  searchProducts: Array<any> = [];
  breadCrumbItems: Array<{}>;
  pricevalue = 100;
  minVal = 200;
  maxVal = 800;

  public isCollapsed = false;
  public filterCollapse = false;
  public colorCollapse = false;
  public customCollapse = false;
  public discountCollapse = true;

  syncing = false;
  priceoption: any = {
    floor: 0,
    ceil: 1000,
    translate: (value: number): string => {
      return '$' + value;
    },
  };
  log = '';
  discountRates: number[] = [];
  public products: productModel[] = [];
  public productTemp: productModel[] = [];

  dataArray = [];
  dataArrayDownload = [];
  brands = [];
  pageSize = 10;
  page = 1;
  sort = ''
  filter: { brandId?: string[] | null, active?: boolean | null, quantity?: number | null, quantityRange?: "max" | "min",  outOfStock?: boolean} = {}

  imgUrl = environment.imageUrl;
  count: number = 0;

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  filterForm = this.fb.group({
    brandId: [[]],
    active: [""],
    quantityRange: ["max"],
    quantity: [""],
    outOfStock: [false]
  })

  toggleColumns = {
    brand: { label: 'Brand', show: true },
    mrp: { label: 'MRP', show: true },
    sp: { label: 'Selling Price', show: true },
    off: { label: 'Off', show: true },
    qty: { label: 'Quantity', show: true },
    sold: { label: 'Sold Units', show: true },
  }

  constructor(
    private apiService: EcommerceService,
    private toaster: ToastrService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private csvService: CsvService
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Products', active: true }];
        
        this.route.queryParams.subscribe((res: any) => {
          setTimeout(() => {
            this.pageSize = res.limit ? parseInt(res.limit) : 10;
            this.page = res.page ? parseInt(res.page) : 1;
            this.getProductList();
          });
        });

        this.getBrands();
        this.checkHiddenColumn();
    });
  }

  getProductList() {
    let params = {
      limit: this.pageSize,
      page: this.page,
      sort: this.sort,
      search: this.search,
      ...this.filter,
    }
    this.spinner.show();
    this.apiService.getProductList(params)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            setTimeout(() => {
              this.dataArray = res.data?.products;
              this.count = res.data.count;
              this.cdr.detectChanges();
            });
          }
        },
        error: (err: any) => {
          this.spinner.hide();
          console.error(err);
        }
      });

  }

  async getProductListForDownload() {
    let params = {
      limit: this.pageSize,
      page: this.page,
      sort: this.sort,
      search: this.search,
      download: true,
      ...this.filter,
    }

    this.spinner.show();
    this.apiService.getProductList(params)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            setTimeout(() => {
                this.dataArrayDownload = res.data?.products;
                this.downloadCSV();
                this.cdr.detectChanges();
            });
          }
        },
        error: (err: any) => {
          this.spinner.hide();
          console.error(err);
        }
      });

  }

  getBrands() {
    this.apiService.getBrandListingAll().subscribe({
        next: (res: any) => {
            setTimeout(() => {
                this.brands = res.data;
                this.cdr.detectChanges();
            });
        },
        error: (err: HttpErrorResponse) => {
            console.error(err);
        }
    });
  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    }
    if (this.search) {
      this.dataArray = this.searchProducts.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    } else {
      this.getProductList();
    }
  }

  onSearch(form: NgForm) {
    this.search = form.value.searchTerm.trim();
    this.page = 1;
    this.getProductList();
  }

  searchFilter(e) {
    const searchStr = e.target.value;
    this.products = productList.filter((product) => {
      return product.name.toLowerCase().search(searchStr.toLowerCase()) !== -1;
    });
  }

  discountLessFilter(e, percentage) {
    if (e.target.checked && this.discountRates.length === 0) {
      this.products = productList.filter((product) => {
        return product.discount < percentage;
      });
    }
    else {
      this.products = productList.filter((product) => {
        return product.discount >= Math.max.apply(null, this);
      }, this.discountRates);
    }
  }

  discountMoreFilter(e, percentage: number) {
    if (e.target.checked) {
      this.discountRates.push(percentage);
    } else {
      this.discountRates.splice(this.discountRates.indexOf(percentage), 1);
    }
    this.products = productList.filter((product) => {
      return product.discount >= Math.max.apply(null, this);
    }, this.discountRates);
  }

  valueChange(value: number, boundary: boolean): void {
    if (boundary) {
      this.minVal = value;
    } else {
      this.maxVal = value;
      this.products = productList.filter(function (product) {
        return product.disRate <= value && product.disRate >= this;
      }, this.minVal);
    }
  }

  onApplyFilters() {
    let { value } = this.filterForm
    let { brandId, active, quantity, quantityRange, outOfStock } = value as any;
    console.log(value);
    this.page = 1;
    this.filter = {
      brandId: (brandId as any)?.length ? brandId : null,
      active: active === "true" ? true : (active === "false" ? false : null),
      quantity: (quantity as any) || null,
      quantityRange: quantityRange as any,
      outOfStock
    }
    
    for (let key in this.filter) {
      if (this.filter[key] == null) delete this.filter[key];
    }
    if (!quantity) delete this.filter.quantityRange;
    this.getProductList()
  }

  onClearFilter() {
    this.filterForm.reset();
    (this.filterForm as any).patchValue({
      status: "",
      quantityRange: "max"
    });
    this.filter = {};
    this.page = 1;
    this.getProductList()
  }

  onDownloadButton(){
    let { value } = this.filterForm
    let { brandId, active, quantity, quantityRange, outOfStock } = value as any;
    this.filter = {
      brandId: (brandId as any)?.length ? brandId : null,
      active: active === "true" ? true : (active === "false" ? false : null),
      quantity: quantity || null,
      quantityRange: quantityRange as any,
      outOfStock
    }
    
    for (let key in this.filter) {
      if (this.filter[key] == null) delete this.filter[key];
    }
    if (!quantity) delete this.filter.quantityRange;
    this.getProductListForDownload()
  }

  onSort({ column, direction }: SortEvent) {
    console.log(column, direction)

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    switch (column as string) {
      case 'mrp': {
        if (direction == 'asc') {
          this.sort = 'lowHighPriceMrp';
        } else if (direction == 'desc') {
          this.sort = 'highLowPriceMrp';
        } else {
          this.sort = '';
        }
        break;
      }
      case 'sellingPrice': {
        if (direction == 'asc') {
          this.sort = 'lowHighPrice';
        } else if (direction == 'desc') {
          this.sort = 'highLowPrice';
        } else {
          this.sort = '';
        }
        break;
      }
      case 'qty': {
        if (direction == 'asc') {
          this.sort = 'lowToHighQuantity';
        } else if (direction == 'desc') {
          this.sort = 'highToLowquantity';
        } else {
          this.sort = '';
        }
        break;
      }
      default: {
        this.sort = '';
      }
    }

    console.log('[sort]', this.sort)
    this.getProductList()
  }

  toggleFxn(value, type) {

    if (type == 'status') {
      value.active = !value.active;

      const data = {
        _id: value._id,
        active: value.active
      }

      this.apiService.updateProduct(data).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                this.toaster.success(res.message);
                this.cdr.detectChanges();
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                this.toaster.error(err.error?.message || 'Error updating product');
                this.cdr.detectChanges();
            });
        }
      });
    }

    if (type == 'approve') {
      value.is.approve = !value.is.approve;

      const data = {
        _id: value._id,
        approve: value.is.approve
      }

      this.apiService.toggleApprove(data).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                this.toaster.success(res.message);
                this.cdr.detectChanges();
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                this.toaster.error(err.error?.message || 'Error toggling approval');
                this.cdr.detectChanges();
            });
        }
      });
    }

  }

  get redirectUrl() {
    return this.router.url
  }

  removeProduct(data) {
    if (!confirm(`Are you sure you want to delete "${data.name}" product ? `)) return;
    this.spinner.show();
    this.apiService.removeProduct(data._id).subscribe({
        next: (res: any) => {
            setTimeout(() => {
                this.spinner.hide();
                this.toaster.success(res.message);
                this.getProductList();
                this.cdr.detectChanges();
            });
        },
        error: (err: any) => {
            setTimeout(() => {
                this.spinner.hide();
                this.toast.error(err?.error?.message);
                this.cdr.detectChanges();
            });
        }
    });
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.router.navigate([], {
      queryParams: { limit: this.pageSize, page: this.page },
      relativeTo: this.route
    });
    this.getProductList();
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

  checkHiddenColumn() {
    let val = localStorage.getItem('productsHiddenColumn'),
      list = [];
    if (val) {
      list = JSON.parse(val)
      for (let key in this.toggleColumns) {
        this.toggleColumns[key].show = true;
      }
      list.forEach(key => this.toggleColumns[key].show = false)
    }
  }

  toggleColumn(item) {
    let obj = this.toggleColumns[item.key];
    obj.show = !obj.show;
    let hidden = []
    for (let key in this.toggleColumns) {
      !this.toggleColumns[key].show && hidden.push(key)
    }
    localStorage.setItem('productsHiddenColumn', JSON.stringify(hidden));
  }

  syncProducts() {
    this.syncing = true;
    this.apiService.syncAlgolia().subscribe((res: any) => {
      this.syncing = false;
      if (res.data)
        this.toaster.success("Product Sync Successful");
    }, (err: HttpErrorResponse) => {
      this.syncing = false;
      this.toaster.error("Unable to fetch data. Please try again after some time")
    })
  }

  downloadCSV() {
    if (!this.dataArrayDownload.length) return;
    let fields = [];
    let brand = "products";
    if(this.filter.brandId !== undefined && this.filter.brandId !== null){
        brand = "products_"+this.dataArrayDownload[0].brandId.name;
    }
    
    this.dataArrayDownload.forEach(product => {
      // build the object safely with optional chaining:
      const document = {
        "Product Name":           product.name ?? '',
        "Brand Name":             product.brandId?.name ?? '',
        "Slug":                   product.slug ?? '',
        "Category":               product.primaryCategory?.name ?? '',
        "Product Weight":         product.weight ?? '',
        "MRP":                    product.price?.mrp ?? '',
        "Selling Price":          product.price?.minPrice ?? '',
        "Product Form":           product.state ?? '',
        "Short Description":      product.description?.short ?? '',
        "Long Description":       product.description?.long ?? '',
        "Quantity":               product.stock?.availableQuantity ?? '',
        "Sold Units":             product.noOfProductSold ?? '',
        "Image Link":             product.thumbnail?.savedName ?? '',
        "Meta Title":             product.metaTitle ?? '',
        "Meta Tag":               product.metaTags ?? '',
        "Meta description":       product.metaDescription ?? '',
      };
    
      fields.push(document);
    });

    try {
      this.csvService.downloadCSV(fields, brand);
    } catch (err: any) {
      console.log("ERROR: " + err.message);
    }
  }

  downLoadCsvFile(csv, brand){
    // Deprecated Functionality
  }     

}
