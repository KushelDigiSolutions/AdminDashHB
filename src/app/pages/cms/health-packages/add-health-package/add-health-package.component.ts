import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  NgModel,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { forkJoin, Observable, of } from "rxjs";
import { FileUploadResponse, FileUploadService } from "src/app/core/services/file-upload.service";
import { DiagnosticsService } from "src/app/pages/diagnostics/diagnostics.service";
import { DoctorsService } from "src/app/pages/doctors/doctors.service";
import { EcommerceService } from "src/app/pages/ecommerce/ecommerce.service";
import { trimInputValue } from "src/app/util/input.util";
import { environment } from "src/environments/environment";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from '../../../../core/models/auth.models';
import { NotificationsService } from "src/app/core/services/notifications.service";
import { LifestyleService } from "src/app/pages/lifestyle/lifestyle.service";


@Component({
  standalone: false,
  selector: "app-add-health-package",
  templateUrl: "./add-health-package.component.html",
  styleUrls: ["./add-health-package.component.scss"],
})
export class AddHealthPackageComponent implements OnInit {



  private search$ = new Subject();
  searchBlogSubject$ = new Subject<string>();
  isConsultant: boolean = false;
  healthPackage;
  testList = [];
  page = 1;
  pageSize = 10;

  public Editor = ClassicEditor;
  editId: string;
  oldFilesThumbnail = [];
  oldFiles = [];
  files = [];
  thumbnail: File[] = [];
  healthConcerns = [];
  products = [];
  articles = [];
  consultants: Array<any> = [];
  templates = [];
  defaultNotifications = [];
  types = this.notificationsService.types;
  showDetail = false;
  s3Base = environment.imageUrl;
  typesObj = this.notificationsService.types.concat(this.notificationsService.personalizedTypes).reduce((obj, noti) => { obj[noti.value] = noti.label; return obj; }, {});
  
  durations = [
    { months: 1, label: "1 Month" },
    { months: 3, label: "3 Month" },
    { months: 6, label: "6 Month" },
    { months: 12, label: "1 Year" },
  ]
  timeSlots = this.notificationsService.getTimeSlots()

  form: FormGroup = this.fb.group({
    thumbnail: [[], Validators.required],
    images: [[]],
    name: ["", [Validators.required]],
    shortDescription: ["", Validators.required],
    price: this.fb.group({
      mrp: ["", Validators.required],
      sellingPrice: ["", Validators.required],
    }),
    metaTitle: "",
    metaDescription: "",
    healthConcerns: [[]],
    totalAppointments: "",
    consultants: [[], [Validators.required]],
    highlights: this.fb.array([""]),
    duration: ["", Validators.required],
    description: "",
    variations: this.fb.array([]),
    published: true,
    active: false,
    diagnosticPackages: [[]],
    notifications: this.fb.array([]),
    relatedBlogs: [[]]
  });

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private eCommerceService: EcommerceService,
    public uploadService: FileUploadService,
    private doctorService: DoctorsService,
    private spinner: NgxSpinnerService,
    private diagnostics: DiagnosticsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private notificationsService: NotificationsService,
    private lifeStyleService: LifestyleService,
  ) { }

  ngOnInit() {

    let userData = this.authService.currentUser()
    if (userData.role.includes('Consultant')) this.isConsultant = true

    if (this.isConsultant) this.form.get('consultants').disable();

    this.search$.pipe(debounceTime(500)).subscribe(this.searchProducts.bind(this))


    this.editId = this.route.snapshot.params.id;
    this.getHealthConcernList();
    this.getConsultantList();
    this.searchArticle();
    this.getDefaultNotifications();
    if (this.editId) {
      this.fetchPackageDetail();
    } else {
      this.onSearchArticle('', 10)
      this.searchProducts({ type: 'labTests', value: '', page: 1, limit: 10 })
      this.searchProducts({ type: 'templates', value: '' })
    }
    // this.getProductList();
  }

  onSearchProducts(event, type: 'labTests' | 'templates') {
    this.search$.next({ value: event.target.value, type })
  }

  searchProducts(val: { value: string, type: 'labTests' | 'templates', page?: number, limit?: number }) {
    // if (!val) return;
    if (val.type == 'labTests') {
      let data: any = {
        type: ['PROFILE', 'OFFER', 'TEST']
      }
      if (val.value) data.keyword = val.value
      if (val.page && val.limit) {
        data.page = val.page
        data.limit = val.limit
      }

      this.diagnostics.searchProducts(data).subscribe(res => {
        let { success, data } = res;
        if (success) {
          this.testList = data;
        }
      }, (err: HttpErrorResponse) => {

      })
    } else if (val.type == 'templates') {
      this.getTemplates(val.value)
    }
  }

  getDefaultNotifications() {
    this.notificationsService.getNotifications({ emptyHealthPackage: true }).subscribe(res => {
      if(res.success){
        this.defaultNotifications = res.data
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  searchArticle() {
    this.searchBlogSubject$
      .pipe(debounceTime(400))
      .subscribe(value => {
        if (value) {
          console.log(value);
          this.onSearchArticle(value, 100)
        }
      })

  }

  onSearchArticle(value: string, limit?: number) {
    this.lifeStyleService.algoliaSearch(value, limit).subscribe((res: any) => {
      if (res.success)
        this.articles = res.data;
    }, (err: HttpErrorResponse) => {
      this.toaster.error(err.error?.message || 'Something went wrong in article search.');
    });
  }

  getDiagnosticPackageDetails() {
    this.diagnostics.getCorporateDiagnosticPackage(this.editId).subscribe(res => {
      let { data, success } = res;
      if (success && data) {
        let { testId, isAvailableInCampCollection } = data;
        this.testList = [testId];

        this.form.patchValue({
          testId: testId._id,
          isAvailableInCampCollection
        });

      } else {
        // this.toastr.error('Diagnostic package not found')
        history.back()
      }
    }, (err: HttpErrorResponse) => {
      // this.toastr.error(err.error?.message || 'Something went wrong');
    });
  }

  createVariationFG(_id = null, name = "", mrp = "", sellingPrice = "", totalAppointments = "", duration = null, highlights = []) {
    return this.fb.group({
      _id,
      name: [name, Validators.required],
      price: this.fb.group({
        mrp: [mrp, [Validators.required]],
        sellingPrice,
      }),
      totalAppointments: [totalAppointments, Validators.required],
      duration: [duration, Validators.required],
      highlights: this.fb.array(highlights),
    })
  }

  createNotificationFG(_id = null, templateId = '', time = '') {

    return this.fb.group({
      _id: [_id],
      templateId: [templateId, Validators.required],
      time: [time, Validators.required]
    })
  }

  getHealthConcernList() {
    this.eCommerceService
      .getHealthConcernListingAll().subscribe((res: any) => {
        if (res.data) {
          this.healthConcerns = res.data;
        }
      }, (err: any) => {

      });
  }

  getConsultantList() {
    this.doctorService.getDoctorListAll().subscribe((res: any) => {
      this.consultants = res.data;
    }, (err: HttpErrorResponse) => { })
  }

  getTemplates(keyword?: string) {
    let healthConcern = [...this.form.value.healthConcerns || []];
    // healthConcern.push('') /** To find out templates without health-concerns */

    let params: any = {
      emptyHealthConcern: true,
      notificationType: ['healthPackage_standard', 'healthPackage_survey'],
      healthConcern,
    }
    if (keyword) params.keyword = keyword;

    this.notificationsService.getNotificationTemplates(params).subscribe(res => {
      let { success, data } = res;
      if (success && data) {
        this.templates = data
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  // getProductList(){
  //   this.eCommerceService.getProductListAll("products/list")
  //   .subscribe((res:any)=>{
  //     this.products =  res.data;
  //   }, 
  //   (err:HttpErrorResponse)=>{
  //     console.log("err",err);
  //   })
  // }

  fetchPackageDetail() {
    this.spinner.show();
    this.eCommerceService.getHealthPackage(this.editId).subscribe(
      (res: any) => {
        this.spinner.hide();
        let data = res.data;
        this.healthPackage = data;
        this.testList = data.diagnosticPackages?.packagesId || [];
        this.articles = data.relatedBlogs;
        this.templates = data.notifications?.filter(el => el.templateId).map(el => el.templateId) || [];

        if (!this.articles.length) this.onSearchArticle('', 10)
        if (!this.testList.length) this.searchProducts({ type: 'labTests', value: '', page: 1, limit: 10 })
        if (!this.templates.length) this.searchProducts({ type: 'templates', value: '' })

        this.form.patchValue({
          thumbnail: data.thumbnail ? [data.thumbnail] : [],
          images: data.images,
          name: data.name,
          shortDescription: data.shortDescription,
          description: data.description,
          price: data.price,
          totalAppointments: data.totalAppointments,
          duration: data.duration,
          healthConcerns: data.healthConcerns.map(el => el._id),
          consultants: data.consultants.map(el => el._id),
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          published: data.published,
          active: data.active,
          diagnosticPackages: data.diagnosticPackages?.packagesId?.map(el => el._id) || [],
          relatedBlogs: data.relatedBlogs?.map(el => el._id) || [],
        });
        data.highlights.forEach(highlight => {
          this.addHighlight(this.highlightsFA, highlight);
        });
        if (this.highlightsFA.length > 1) {
          this.highlightsFA.removeAt(0)
        }
        data.variations.forEach(variation => {
          let { _id, price, name, totalAppointments, duration, highlights } = variation;
          this.variationsFA.push(this.createVariationFG(_id, name, price.mrp, price.sellingPrice, totalAppointments, duration, highlights))
        });
        data.notifications?.forEach(notification => {
          let { _id, templateId, time } = notification;
          this.notificationsFA.push(this.createNotificationFG(_id, templateId?._id || null, time));
        });
      },
      (err) => {
        this.spinner.hide();
        this.router.navigateByUrl("/ecommerce/brand");
      }
    );
  }


  trim(input: NgModel | AbstractControl) {
    trimInputValue(input)
  }

  get highlightsFA() {
    return <FormArray>this.form.get("highlights");
  }

  get variationsFA() {
    return <FormArray>this.form.get("variations");
  }

  get notificationsFA() {
    return (<FormArray>this.form.get("notifications"));
  }

  addHighlight(formArray: FormArray, value = "") {
    formArray.push(this.fb.control(value));
  }

  removeHighlight(formArray: FormArray, i: number) {
    formArray.removeAt(i);
  }

  addVariation() {
    this.variationsFA.push(this.createVariationFG());
  }

  removeVariation(i: number) {
    this.variationsFA.removeAt(i);
  }

  addNotification() {
    this.notificationsFA.push(this.createNotificationFG());
  }

  removeNotification(i: number) {
    this.notificationsFA.removeAt(i);
  }

  typeOf(data) {
    return typeof data
  }

  addHealthPackage() {
    let { thumbnail, images, ...value } = this.form.value;
    let uploadReq: Observable<FileUploadResponse | null>[] = [];

    if (thumbnail[0] instanceof File) {
      uploadReq.push(this.uploadService.fileUpload(thumbnail))
    } else {
      uploadReq.push(of(thumbnail[0] ? { success: true, data: [thumbnail[0]._id] } : null))
    }

    let oldImages = [], newImages = [];

    images.forEach(image => {
      if (image instanceof File) {
        newImages.push(image)
      } else {
        oldImages.push(image._id)
      }
    });
    uploadReq.push(of({ success: true, data: oldImages }))
    newImages.length && uploadReq.push(this.uploadService.fileUpload(newImages))

    this.spinner.show();
    forkJoin(uploadReq).subscribe(
      (res) => {
        value = JSON.parse(JSON.stringify(value));
        let [thumbnailRes, ...imagesRes] = res;
        if (thumbnailRes && thumbnailRes.data[0]) {
          value.thumbnail = thumbnailRes.data[0];
        }
        value.images = [];
        imagesRes.forEach(el => {
          el.data.forEach(imgId => {
            value.images.push(imgId)
          });
        });

        value.variations.forEach((el) => {
          if (!el._id) delete el._id;
        });

        (this.editId
          ? this.eCommerceService.updateHealthPackage(this.healthPackage._id, value)
          : this.eCommerceService.addHealthPackage(value)
        ).subscribe(
          (res: any) => {
            this.spinner.hide();
            this.toaster.success(res.message);
            if (!this.isConsultant) this.router.navigateByUrl("/health-packages");
            else this.router.navigateByUrl("/consultant/health-packages");

          },
          (err: HttpErrorResponse) => {
            this.spinner.hide();
            this.toaster.error(err.error?.message || 'Something went wrong');
          }
        );
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err.error?.message || 'Something went wrong');
      }
    );
  }

}
