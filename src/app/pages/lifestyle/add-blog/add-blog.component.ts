import { firstValueFrom } from 'rxjs';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EcommerceService } from "../../ecommerce/ecommerce.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { environment } from "src/environments/environment";
import { MyUploadAdapter } from "./MyUploadAdapter";
import { LifestyleService } from "../lifestyle.service";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { CmsService } from "../../cms/cms.service";
import { debounceTime } from "rxjs/operators";
import { User } from "src/app/core/models/auth.models";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { CkUploadAdapter } from "src/app/util/ckeditor.util";
import { getFormatedDate } from "src/app/util/date.util";

@Component({
  standalone: false,
  selector: "app-add-blog",
  templateUrl: "./add-blog.component.html",
  styleUrls: ["./add-blog.component.scss"],
})
export class AddBlogComponent implements OnInit, AfterViewInit {
  @ViewChild("editor") editor;

  searchSubject$ = new Subject<string>();
  public Editor = ClassicEditor;

  config = {
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    },
    link: {
      // addTargetToExternalLinks: true,
      decorators: {
        addTargetToExternalLinks: {
          mode: 'manual',
          label: 'External Link',
          defaultValue: false,
          attributes: {
            // target: '_blank',
            rel: 'nofollow'
          }
        },
        openInNewTab: {
          mode: 'manual',
          label: 'Open in new Tab',
          defaultValue: true,
          attributes: {
            target: '_blank',
          }
        }
      }
    }
  };
  s3Base = environment.imageUrl;
  breadCrumbItems: Array<{}>;
  user: User;
  healthConcerns = [];
  categories = [];
  products = [];
  articles = [];
  oldFiles = [];
  files = [];
  thumbnailFiles = [];
  thumbnailOldFiles = [];

  authors = [];

  blogType = [{ value: "internal" }, { value: "external" }];

  language = [
    {
      'name': 'English',
      'value': 'english'
    },
    {
      'name': 'Hindi',
      'value': 'hindi'
    },
  ]

  form: FormGroup;

  validExcerpt = true;
  editId;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private eCommerceService: EcommerceService,
    private cmsService: CmsService,
    private toaster: ToastrService,
    private lifeStyleService: LifestyleService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.fetchBlog();
    }

    this.form = this.formBuilder.group({
      title: ["", [Validators.required]],
      titleName: ["", [Validators.required]],
      blogType: "internal",
      canonical: "",
      url: "",
      author: [null],
      otherAuthor: formBuilder.group({
        name: [{ value: "", disabled: true }, Validators.required]
      }),
      primaryHealthConcern: ["", Validators.required],
      healthConcerns: [[], this.formBuilder.array([])],
      categories: [[], this.formBuilder.array([])],
      products: [[], this.formBuilder.array([])],
      relatedArticle: "",
      websiteRelatedBlog: [[]],
      featuredImage: ["", [Validators.required]],
      excerpt: "",
      description: "",
      createdAt: "",
      metaTitle: "",
      metaDescription: "",
      thumbnail: "",
      // isShortLength: false,
      language: "english",
      isShortLength: [false],
      isHerbRelated: [false],
    });
  }

  ngOnInit() {
    console.log(this.editor);

    this.breadCrumbItems = [
      { label: "Lifestyle" },
      { label: "Add Blog", active: true },
    ];
    this.user = this.authService.currentUser();
    this.getHealthConcernsAll();
    this.getCategoriesAll();
    this.getProductsAll();
    this.getAuthors();
    this.searchArticle();
  }

  ngAfterViewInit(): void {
    console.log(this.editor);
  }

  get f() {
    return this.form.controls
  }

  MyCustomUploadAdapterPlugin(editor) {
    console.log("here");
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return new MyUploadAdapter(loader);
    };
  }

  fetchBlog() {
    this.spinner.show();
    this.lifeStyleService
      .getBlogDetail(this.editId)
      .subscribe((res: any) => {
        this.spinner.hide();
        let { blog } = res;
        this.oldFiles = blog.featuredImage ? [blog.featuredImage] : [];
        this.thumbnailOldFiles = blog.thumbnail ? [blog.thumbnail] : [];
        let dataHealthConcern = [];
        let dataCategories = [];
        let dataProducts = [];
        if (blog.healthConcerns) {
          for (let healthConcern of blog.healthConcerns) {
            dataHealthConcern.push(healthConcern._id);
          }
        }
        if (blog.categories) {
          for (let categories of blog.categories) {
            dataCategories.push(categories._id);
          }
        }
        if (blog.products) {
          this.products = blog.products.map((el: any) => {
            return { name: el.name, _id: el._id }
          })
          for (let products of blog.products) {

            dataProducts.push(products._id);
          }
        }
        this.articles = blog.websiteRelatedBlog;
        if (blog.relatedArticle && this.articles.findIndex(el => el._id == blog.relatedArticle._id) == -1) {
          this.articles.push(blog.relatedArticle);
        }
        this.form.patchValue({

          title: blog.title,
          titleName: blog.titleName,
          blogType: blog.blogType,
          canonical: blog.canonical,
          url: blog.url,
          author: blog.author?._id || (blog.otherAuthor ? 'other' : null),
          otherAuthor: blog.otherAuthor || { name: '' },
          primaryHealthConcern: blog.primaryHealthConcern._id,
          healthConcerns: dataHealthConcern,
          categories: dataCategories,
          products: dataProducts,
          relatedArticle: blog.relatedArticle?._id || "",
          websiteRelatedBlog: blog.websiteRelatedBlog.map(el => el._id),
          thumbnail: blog.thumbnail ? [blog.thumbnail._id] : [],
          featuredImage: [this.oldFiles[0]._id],
          excerpt: blog.excerpt,
          description: blog.description,
          createdAt: getFormatedDate(blog.createdAt),
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
          isShortLength: blog.isShortLength,
          isHerbRelated: blog.isHerbRelated,
          language: blog.language,

        });
        this.onChangeAuthor();
      }, (err: any) => {
        console.log("er", err);
        this.spinner.hide();
        this.navigateToList();
      });
  }

  getHealthConcernsAll() {
    firstValueFrom(this.eCommerceService.getHealthConcernListingAll())
      .then((res: any) => {
        if (res.data) {
          this.healthConcerns = res.data;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.error.message);
      });
  }

  getCategoriesAll() {
    firstValueFrom(this.cmsService.getLifestyleCategoryListingAll())
      .then((res: any) => {
        this.categories = res.data;
      })
      .catch((err: any) => {
        this.toaster.error(err.error.message);
      });
  }
  getProductsAll() {
    firstValueFrom(this.eCommerceService.getProductListAll("products/list"))
      .then((res: any) => {
        this.products = res.data;
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  }

  getAuthors() {
    this.lifeStyleService.getAuthors().subscribe(
      (res: any) => {
        this.authors = res.data;
      },
      (err: any) => {
        console.log("err", err);
      }
    );
  }

  onSelect(event, ofImage) {
    if (ofImage == 'thumbnail') {
      let file = event.addedFiles[0];
      if (file) {
        this.thumbnailOldFiles = [];
        this.thumbnailFiles = [file];
        this.form.patchValue({ thumbnail: this.thumbnailFiles });
        this.form.get("thumbnail").markAsTouched();
      }

    }
    if (ofImage == 'featuredImage') {
      console.log(ofImage);
      let file = event.addedFiles[0];
      if (file) {
        this.oldFiles = [];
        this.files = [file];
        this.form.patchValue({ featuredImage: this.files });
        this.form.get("featuredImage").markAsTouched();
      }
    }
  }



  onRemove(i: number, ofImage) {
    if (ofImage == 'featuredImage') {
      this.files.splice(i, 1);
      this.form.patchValue({ featuredImage: this.files });
      this.updateImageControl(this.files, 'featuredImage');
    } else if (ofImage == 'thumbnail') {
      this.thumbnailFiles.splice(i, 1);
      this.form.patchValue({ thumbnail: this.thumbnailFiles });
      this.updateImageControl(this.thumbnailFiles, 'thumbnail');
    }
  }

  onRemoveOldFile(i: number, ofImage) {
    if (ofImage == 'featuredImage') {
      this.oldFiles.splice(i, 1);
      this.updateImageControl(this.oldFiles, 'featuredImage');
    } else if (ofImage == 'thumbnail') {
      this.thumbnailOldFiles.splice(i, 1);
      this.updateImageControl(this.thumbnailOldFiles, 'thumbnail');
      console.log('thumbNail image removied');
    }
  }

  updateImageControl(files, controlName) {
    this.form.patchValue({ [controlName]: files });
    this.form.get(controlName).markAsTouched();
  }

  countWords(event) {
    let words = event.target.value;
    words = words.split(" ");
    if (words.length > 70) {
      this.validExcerpt = false;
    } else {
      this.validExcerpt = true;
    }
  }

  searchArticle() {
    this.searchSubject$
      .pipe(debounceTime(400))
      .subscribe(value => {
        if (value) {
          console.log(value);
          this.lifeStyleService.algoliaSearch(value).subscribe((res: any) => {
            if (res.success)
              this.articles = res.data;
          }, (err: HttpErrorResponse) => {
            this.toaster.error(err.error?.message || 'Something went wrong in article search.');
          });
        }
      })

  }

  onChangeAuthor() {
    let { author } = this.form.value;
    if (author == 'other') {
      this.f.otherAuthor.get('name').enable()
    } else {
      this.f.otherAuthor.get('name').disable()
    }
    console.log(this.form.value);
  }


  publishBlog() {
    if (this.form.valid && this.validExcerpt) {
      let value = { ...this.form.value };

      if (!value.language) value.language = 'english';

      if (!value.relatedArticle) value.relatedArticle = null;
      let { featuredImage, thumbnail } = value;
      let uploadReq: Observable<any>[] = [];
      if (thumbnail[0] && typeof thumbnail[0] == "string") {
        uploadReq.push(of({ success: true, data: [{ imageId: this.thumbnailOldFiles[0]._id }] }));
      } else if (thumbnail[0]) {
        // {folder:"blog/thumbnail"}
        uploadReq.push(this.lifeStyleService.fileUpload(thumbnail));
      }
      else {
        uploadReq.push(of({ success: true, data: [] }));
      }

      if (typeof featuredImage[0] == "string") {
        uploadReq.push(of({ success: true, data: [{ imageId: this.oldFiles[0]._id }] }));
      } else {
        uploadReq.push(this.lifeStyleService.fileUpload(
          featuredImage,
          "blog/featuredImage"
        ));
      }
      this.spinner.show();
      forkJoin(uploadReq).subscribe(
        (res) => {
          if (res[0].data[0]) {
            value.thumbnail = res[0].data[0].imageId;
            console.log(value.thumbnail, "checking");
          } else {
            value.thumbnail = null
          }
          value.featuredImage = res[1].data[0].imageId;
          if (this.editId) {
            value._id = this.editId;
          }
          if (value.author == 'other') {
            value.author = null
          } else {
            value.otherAuthor = null
          }
          (this.editId
            ? this.lifeStyleService.updateBlog(value)
            : this.lifeStyleService.publishBlog(value)
          ).subscribe(
            (res: any) => {
              this.toaster.success(res.message);
              this.navigateToList()
              this.spinner.hide();
            },
            (err: HttpErrorResponse) => {
              this.toaster.error(err.error.message);
              this.spinner.hide();
            }
          );
        },
        (err) => {
          this.spinner.hide();
          this.toaster.error(err.error.message);
        }
      );
    } else {
      this.toaster.error("Please fill all the required fields");
    }
  }

  navigateToList() {
    this.router.navigateByUrl('/lifestyle/blogs' + (this.user.role.includes('Admin') ? '/all' : ''))
  }

  onReadyEditor(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return new CkUploadAdapter(loader, 'blogupload', 'blog/tile');
    };
  }
}
