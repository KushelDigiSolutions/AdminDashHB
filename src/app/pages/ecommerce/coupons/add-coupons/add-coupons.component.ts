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
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../../shared/ui/ui.module';
import { EcommerceService } from '../../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../core/models/auth.models';
import { getFormatedDate } from '../../../../util/date.util';
import { CorporateService } from '../../../../pages/corporate/corporate.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    NgbModalModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: "app-add-coupons",
  templateUrl: "./add-coupons.component.html",
  styleUrls: ["./add-coupons.component.scss"],
})
export class AddCouponsComponent implements OnInit {
  form = this.formBuilder.group({
    code: ["", [Validators.required]],
    title: [""],
    category: ["shop"],
    couponType: ["all"],
    validFrom: [""],
    validTo: [""],
    noOfUsage: [1],
    isPercent: ['false'],
    maxDiscount: [""],
    discount: [""],
    minSpending: [""],
    date: [""],
    TnC: [""],
    userType: [[], this.formBuilder.array([])],
    brandId: [[], this.formBuilder.array([])],
    usedByNumber: [""],
    reusability: [0],
    companyId: [[]],
    active: true,
    _id: "",
  });

  healthConcernList = [];
  brandData: any;
  userList = [];
  companyList = [];
  userSpecificCoupon = false;
  brandSpecificCoupon = false;
  userSpecificTypeCoupon = false;
  percentageDiscount = 'false';
  show = false;
  hidden = true;
  selected: any;
  public Editor = ClassicEditor;
  editId: any;

  userTypeArray = [
    { name: "New", value: "new" },
    { name: "Loyal", value: "loyal" },
    { name: "Platinum", value: "platinum" },
    { name: "All", value: "all" },
  ];

  typeList = [
    { name: "All", value: "all" },
    { name: "Brand Specific", value: "brandSpecific" },
    { name: "Corporate Specific", value: "corporateSpecific" },
    { name: "User Specific", value: "userSpecific" },
    { name: "User Type Specific", value: "userTypeSpecific" },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apiService: EcommerceService,
    private corporateService: CorporateService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private calendar: NgbCalendar
  ) { }

  ngOnInit() {
    this.getCompanyList();
    this.getBrandList();
    this.getUserList();
    this.editId = this.route.snapshot.params.id;
    if (this.editId) this.fetchCouponDetail();
  }

  get f() {
    return this.form.controls;
  }

  getUserList() {
    this.apiService.getUserListAll().subscribe((res: any) => this.userList = res.data);
  }

  getBrandList() {
    this.apiService.getBrandListingAll().subscribe((res: any) => this.brandData = res.data);
  }

  getCompanyList() {
    this.corporateService.getCompanyList().subscribe((res: any) => this.companyList = res.data);
  }

  fetchCouponDetail() {
    this.spinner.show();
    this.apiService.getCouponDetail(this.editId).subscribe(
      (res: any) => {
        this.spinner.hide();
        let { data } = res;
        let { validFrom, validTo } = data;
        if (validFrom) validFrom = getFormatedDate(validFrom, 'YYYY-MM-DD');
        if (validTo) validTo = getFormatedDate(validTo, 'YYYY-MM-DD');

        this.form.patchValue({
          code: data.code,
          title: data.title || '',
          category: data.category,
          couponType: data.couponType,
          companyId: data.companyId,
          validFrom,
          validTo,
          noOfUsage: data.noOfUsage,
          isPercent: data.isPercent ? 'true' : 'false',
          maxDiscount: data.maxDiscount,
          discount: data.discount,
          minSpending: data.minSpending,
          TnC: data.TnC,
          date: validFrom + ' - ' + validTo,
          userType: data.userType,
          brandId: data.brandId.map(b => b._id),
          usedByNumber: data.usedByNumber?.users || "",
          reusability: 0,
          _id: data._id,
          active: data.active,
        });
        this.couponTypeChanged(data.couponType);
        this.percentageDiscount = this.form.get("isPercent").value;
      },
      () => {
        this.spinner.hide();
        this.router.navigateByUrl("/ecommerce/coupons");
      }
    );
  }

  couponTypeChanged(event) {
    this.userSpecificCoupon = event == "userSpecific";
    this.brandSpecificCoupon = event == "brandSpecific";
    this.userSpecificTypeCoupon = event == "userTypeSpecific";
    this.show = event !== 'all';
  }

  addCoupon() {
    const value: any = { ...this.form.value };
    value.isPercent = value.isPercent == 'true';
    if (value.isPercent && Number(value.discount) > 100) {
      this.toaster.error('Discount value should be less than or equal to 100');
      return;
    }
    if (value.couponType == "userSpecific") {
      value.usedByNumber = { users: value.usedByNumber, noOfUsage: 0 };
    }
    if (value.brandId && !value.brandId.length) delete value.brandId;
    if (!value._id) delete value._id;
    delete value.reusability;

    this.spinner.show();
    (this.editId ? this.apiService.updateCoupon(value) : this.apiService.addCoupon(value)).subscribe((res: any) => {
      this.spinner.hide();
      this.toaster.success(res.message);
      this.router.navigate(["/ecommerce/coupons"]);
    }, (err) => {
      this.spinner.hide();
      this.toaster.error(err.error?.message || 'Something went wrong!');
    });
  }

  trim(input: any) {
    if (input instanceof AbstractControl) input.setValue(input.value.trim());
    else if (input.control) input.control.setValue(input.value.trim());
  }

  onChangeCoupon() {
    this.form.patchValue({ code: String(this.form.get('code').value).toUpperCase() });
  }

  onDateSelection(date: NgbDate) {
    const dateStr = `${date.year}-${date.month}-${date.day}`;
    this.form.patchValue({ date: dateStr, validFrom: dateStr, validTo: dateStr });
  }
}
