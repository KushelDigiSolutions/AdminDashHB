import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, firstValueFrom } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/pages/ecommerce/sortable-directive';
import { environment } from 'src/environments/environment';
import { CmsService } from '../../cms.service';

@Component({
  standalone: false,
  selector: 'app-life-style-category-list',
  templateUrl: './life-style-category-list.component.html',
  styleUrls: ['./life-style-category-list.component.scss']
})
export class LifeStyleCategoryListComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tempPageSize: any;
  tempsearchTerm: any;
  pageSize = 10;
  page = 1;
  search: string = '';

  dataArray = [];
  imgUrl=environment.imageUrl;

  childId;


  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private cmsService: CmsService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Lifestyle Category', active: true }];

    this.childId = this.route.snapshot.params.id;
    this.childId
    ?this.fetchCategory()
    :this.getCategoryList();

  }

  getCategoryList() {
    const url = `limit=${this.pageSize}&page=${this.page}`;
    firstValueFrom(this.cmsService.getLifestyleCategoryList(url))
      .then((res: any) => {
        setTimeout(() => {
          if (res.data.categories) {
            this.dataArray = res.data.categories;
          }
          this.cdr.detectChanges();
        });
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  }

  fetchCategory(){
    let url = `/detail ? _id=${this.childId}`;
   
    firstValueFrom(this.cmsService.getLifestyleCategoryList(url))
     .then((res : any)=>{
       setTimeout(() => {
         this.dataArray = res.data.children;
         this.cdr.detectChanges();
       });
     })
     .catch((err:any)=>{
     })
  }

  changeValue(event, type) {
    if (type == 'page') {
      this.page = event;
    } 
    this.getCategoryList();
  }

  removeCategory(id){
    firstValueFrom(this.cmsService.removeLifestyleCategory(id))
    .then((res:any)=>{
      this.toaster.success(res.message);
      this.childId
      ?this.fetchCategory()
      :this.getCategoryList();
    })
    .catch((err:any)=>{});
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
      this.cmsService.toggleLifestyleCategoryTop(body).subscribe(res => {
        data.toggleTopLoading = false;
        data.isTop = !data.isTop;
        observer.next(true)
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
      this.cmsService.toggleLifestyleCategoryFeatured(body).subscribe(res => {
        data.toggleFeaturedLoading = false;
        data.isFeatured = !data.isFeatured;
        observer.next(true)
      }, error => {
        data.toggleFeaturedLoading = false;
        observer.next(false)
      })
    });

  }

  navigateToCategory(data){
    this.router.navigate(['ecommerce/add-category'],{state:{data:data}});
  }

}
