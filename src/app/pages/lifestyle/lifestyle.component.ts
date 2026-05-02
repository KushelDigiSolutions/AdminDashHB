import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { User } from "src/app/core/models/auth.models";
import { RequestHttpParams } from "src/app/core/services/api.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { environment } from "src/environments/environment";
import { UserService } from "../contacts/userlist/user.service";
import { RemoveModalComponent } from "../ecommerce/modals/remove/remove-modal/remove-modal.component";
import { LifestyleService } from "./lifestyle.service";

@Component({
  standalone: false,
  selector: "app-lifestyle",
  templateUrl: "./lifestyle.component.html",
  styleUrls: ["./lifestyle.component.scss"],
})
export class LifestyleComponent implements OnInit {
  user: User;
  search: string = '';
  path: string;
  breadCrumbItems: Array<{}>;
  tempPageSize: any;
  tempsearchTerm: any;
  pageSize = 10;
  page = 1;
  count: number;
  imgUrl = environment.imageUrl;

  dataArray = [];
  searchBlogs: any;

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private authService: AuthenticationService,
    private apiService: LifestyleService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    let urlSegments = this.route.snapshot.url;
    this.path = urlSegments[urlSegments.length - 1].path;
    this.user = this.authService.currentUser()

    this.breadCrumbItems = [
      { label: "LifeStyle" },
      { label: "Blogs", active: true },
    ];
    console.log();

    this.getBlogList();
  }

  getBlogList() {
    let params: RequestHttpParams = {
      limit: this.pageSize,
      page: this.page
    };

    if (this.user.role.includes('Admin') || this.user.role.includes('Publisher') && this.path == 'all') {
      this.apiService.getBlogList(params).subscribe((res: any) => {
        setTimeout(() => {
          if (res.data) {
            this.dataArray = res.data;
            console.log('this.dataArray = ', this.dataArray);
            this.count = res.count;
          }
          this.cdr.detectChanges();
        });
      }, (err: any) => {
        console.log("err", err);
      })
    } else {
      this.apiService.getMyBlogs(params).subscribe((res: any) => {
        setTimeout(() => {
          if (res.success) {
            this.dataArray = res.data;
            this.count = res.count;
          }
          this.cdr.detectChanges();
        });
      }, (err: any) => {
        console.log("err", err);
      })
    }

  }

  changeValue(event, type) {
    if (type == "page") {
      this.page = event;
    }
    this.getBlogList();
  }

  toggleFxn(data, type) {
    return new Observable((observer) => {
      console.log(data);
      type == "popular" ? (data.togglePopularLoading = true) : type == "status" ? (data.toggleStatusLoading = true) : type == "published" ? (data.togglePublishedLoading = true) : '';

      if (type != "published") {
        let body = {
          popular: data.popular,
          status: data.status,
          _id: data._id,
        };
        type == "popular"
          ? (body.popular = !body.popular)
          : type == "status"
            ? (body.status = !body.status)
            : "";
        this.apiService.updateBlog(body).subscribe(
          (res) => {
            type == "popular"
              ? (data.togglePopularLoading = false)
              : type == "status"
                ? (data.toggleStatusLoading = false)
                : "";
            type == "popular"
              ? (data.popular = !data.popular)
              : type == "status"
                ? (data.status = !data.status)
                : "";
            observer.next(true);
          },
          (error) => {
            type == "popular"
              ? (data.togglePopularLoading = false)
              : type == "status"
                ? (data.toggleStatusLoading = false)
                : "";
            observer.next(false);
          }
        );
      } else {
        let { _id, isPublished } = data
        this.apiService.toggleIsPublish({ _id, isPublished: !isPublished }).subscribe((res: any) => {
          if (res.success) {
            data.isPublished = !isPublished;
            data.togglePublishedLoading = false
            observer.next(true);
          } else {
            observer.next(false);
          }
        }, (err: HttpErrorResponse) => {
          data.togglePublishedLoading = false
          observer.next(false);
        })
      }

    });
  }

  toggleFxnisShortLength(data, type) {
    return new Observable((observer) => {

      data.isShortLength = !data.isShortLength ? true : false;

      let body = {
        _id: data._id,
        isShortLength: data.isShortLength,
      }

      this.apiService.updateBlog(body).subscribe(
        (res) => {
          this.getBlogList();
          data.toggleisShortLoading = false;
          // observer.next(true);
        },
        (error) => {
          observer.next(false);
          this.toaster.show('Something Wrong')
        }
      );
    });

    // data.isShortLength = !data.isShortLength ? true : false;

    // let body = {
    //   _id: data._id,
    //   isShortLength: data.isShortLength,
    // }

    // this.apiService.updateBlog(body).subscribe(
    //   (res) => {
    //     this.getBlogList();
    //     data.toggleisShortLoading = false;
    //     // observer.next(true);
    //   },
    //   (error) => {
    //     // observer.next(false);
    //     this.toaster.show('Something Wrong')
    //   }
    // );
    // return;
  }

  toggleFxnisHerb(data, type) {
    return new Observable((observer) => {

      // set loading flag
      data.toggleisHerbLoading = true;
      // toggle local value
      data.isHerb = !data.isHerbRelated;

      let body = {
        _id: data._id,
        isHerbRelated: data.isHerb,
      }

      this.apiService.updateBlog(body).subscribe(
        (res) => {
          // refresh list or update flags
          this.getBlogList();
          data.toggleisHerbLoading = false;
          observer.next(true);
        },
        (error) => {
          data.toggleisHerbLoading = false;
          observer.next(false);
          this.toaster.show('Something Wrong')
        }
      );
    });
  }

  removeBlog(blog) {
    if (!this.canDelete(blog)) return;
    const data = {
      value: 'blog',
      type: 'blog'
    }

    let modal = this.modal.open(RemoveModalComponent, { size: 'lg' });

    modal.componentInstance.data = data;

    modal.result.then((result) => {
      if (result == 'yes') {
        firstValueFrom(this.apiService.removeBlog(blog._id))
          .then((res: any) => {
            this.toaster.success(res.message);
            this.getBlogList();
          })
          .catch((err: any) => {
            this.toaster.error(err.error);
          });
      }
    })
  }

  isShowPopularCol() {
    return this.user.role.includes('Admin')
  }
  isShowHerbCol() {
    return this.user.role.includes('Admin')
  }
  isShowStatusCol() {
    return this.user.role.includes('Admin')
  }
  isShowShortCol() {
    return this.user.role.includes('Admin')
  }
  isShowPublishCol() {
    return this.user.role.includes('Admin') || this.user.role.includes('Publisher')
  }
  canTogglePublished(data) {
    return this.apiService.canTogglePublished(data, this.user, this.path)
  }
  canEdit(data) {
    return this.apiService.canEdit(data, this.user, this.path)
  }

  canDelete(data) {
    return this.apiService.canDelete(data, this.user)
  }

  // onSort({ column, direction }: SortEvent) {

  //   // resetting other headers
  //   this.headers.forEach(header => {
  //     if (header.sortable !== column) {
  //       header.direction = '';
  //     }
  //   });

  // }
  onSearch(form: NgForm) {
    this.search = form.value.searchTerm.trim();
    this.page = 1;
    if (this.search) {
      this.apiService.algoliaSearch(this.search).subscribe((res: any) => {
        this.dataArray = res.data;
      });
    } else {
      this.getBlogList();
    }
  }
}
