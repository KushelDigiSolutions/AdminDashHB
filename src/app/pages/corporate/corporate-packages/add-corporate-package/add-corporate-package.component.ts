import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ContactsService } from 'src/app/pages/contacts/contacts.service';
import { DiagnosticsService } from 'src/app/pages/diagnostics/diagnostics.service';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';
import { trimInputValue } from 'src/app/util/input.util';

import { CorporateService } from '../../corporate.service';

@Component({
  standalone: false,
  selector: 'app-add-corporate-package',
  templateUrl: './add-corporate-package.component.html',
  styleUrls: ['./add-corporate-package.component.scss']
})
export class AddCorporatePackageComponent implements OnInit {

  searchConsultants$ = new Subject<string>();

  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Package", active: true },
  ];
  tabsMap = {
    lifestyletips: 2,
    webinarlist: 3,
    emaillogs: 4,
    diagnostics: 5,
    camp: 6,
  };
  activeTab = 1;
  editId: string;
  oldData: any;
  submitted = false;
  durations = [
    { months: 1, label: "1 Month" },
    { months: 3, label: "3 Month" },
    { months: 6, label: "6 Month" },
    { months: 12, label: "1 Year" },
  ]

  form = this.fb.group({
    name: ["", Validators.required],
    description: [""],
    totalAppointments: [null as number | null, [Validators.required, Validators.min(0), Validators.max(10)]],
    duration: ["", Validators.required],
    price: this.fb.group({
      mrp: [null as number | null, [Validators.required, Validators.min(0)]],
      sellingPrice: [null as number | null, Validators.min(0)],
      discount: [0, [Validators.min(0), Validators.max(100)]],
    }),
    costPrice: [null as number | null, Validators.min(0)],
    margin: [0, [Validators.min(0), Validators.max(100)]],
    company: ["", Validators.required],
    consultantType: "",
    consultants: [[] as any[]],
    healthConcerns: [[] as any[]],
    lifestyleTips: [[] as any[]],
    isActive: true,
  });
  consultants = [];
  lastConsultantSearch: string;
  companies = [];
  doctorTypes = [];
  emptylist = [];

  lifestyleTips = [];
  webinars = [];
  emails = [];
  diagnosticPackages = [];
  campCollectionList = [];
  registeredEmployees = [];
  bookings = [];

  pagination = {
    lifestyleTips: {
      limit: 10,
      page: 1,
      total: 0
    },
    webinars: {
      limit: 10,
      page: 1,
      total: 0
    },
    emails: {
      limit: 10,
      page: 1,
      total: 0
    },
    diagnostics: {
      limit: 10,
      page: 1,
      total: 0
    },
    camp: {
      limit: 10,
      page: 1,
      total: 0
    },
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
    private contactsService: ContactsService,
    private eCommerceService: EcommerceService,
    private diagnosticService: DiagnosticsService,
    private toaster: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    this.activeTab = (this.tabsMap as any)[this.route.snapshot.queryParams.view] || 1;

    this.searchConsultants$.pipe(debounceTime(500)).subscribe(this.searchConsultants.bind(this))

    if (this.editId) {
      this.getDetails();
      this.getLifestyleTipsList();
      this.getWebinarsList();
      this.getEmailsList();
      this.getDiagnosticPackages();
      this.getCampCollectionList();
    }
    this.getCompanies();
    this.searchConsultants();
    this.getTypes();
  }

  onSubmit() {
    this.submitted = true;
    let { valid, value } = this.form;

    if (valid) {
      const processedValue = JSON.parse(JSON.stringify(value));
      delete processedValue.price.discount;
      delete processedValue.margin;
      delete processedValue.consultantType;

      let req = this.corporateService.createCorporatePackage(processedValue);
      if (this.editId) {
        req = this.corporateService.updateCorporatePackage(this.editId, processedValue);
      }

      this.spinner.show();
      req.subscribe((res: any) => {
        this.spinner.hide();
        if (!this.editId) {
          this.oldData = res.data;
          this.editId = res.data._id;
        }
        this.toastr.success(this.editId ? 'Package details updated' : 'Package created successfully');

      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
      });

    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  getDetails() {
    this.spinner.show();
    this.corporateService.getCorporatePackage(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.data) this.goBackToList();
      this.oldData = res.data;
      let { name, description, duration, price, costPrice, totalAppointments, consultants, company, isActive } = this.oldData;
      if (!this.companies.length) {
        this.companies.push(company)
      }
      this.consultants = consultants || [];
      this.form.patchValue({
        name: name,
        description: description || "",
        duration: duration,
        price: price,
        costPrice: costPrice || 0,
        totalAppointments: totalAppointments || '',
        company: company ? company._id : "",
        consultants: (consultants || []).map(el => el._id),
        isActive: isActive != undefined ? isActive : true,
      } as any);
      this.calculate('discount');
      this.calculate('margin');
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.goBackToList()
    })
  }

  getCompanies() {
    this.corporateService.getCompanyList().subscribe((res: any) => {
      this.companies = res.data;
    }, (err: HttpErrorResponse) => {

    })
  }

  getTypes() {
    this.eCommerceService.getTypes().subscribe((res: any) => {
      this.doctorTypes = res.data;

    }, err => {

    });
  }

  getLifestyleTipsList() {
    let params = {
      limit: this.pagination.lifestyleTips.limit,
      page: this.pagination.lifestyleTips.page,
      corporatePackage: this.editId,
    }
    this.spinner.show();
    this.corporateService.getLifestyleTipsList(params).subscribe((res: any) => {
      this.spinner.hide();
      this.pagination.lifestyleTips.total = res.count || 0;
      this.lifestyleTips = res.data;
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });

  }

  getWebinarsList() {
    let params = {
      limit: this.pagination.webinars.limit,
      page: this.pagination.webinars.page,
      corporatePackage: this.editId,
    }
    this.spinner.show();
    this.corporateService.getCorporateWebinarList(params).subscribe((res: any) => {
      this.spinner.hide();
      this.pagination.webinars.total = res.count;
      this.webinars = res.data.map(el => {
        let { date, time } = el;
        let [h, m] = time.split(':');
        const d = new Date(date).setHours(Number(h), Number(m), 0, 0);
        el.date = d;
        return el;
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });

  }

  getEmailsList() {
    let params = {
      limit: this.pagination.emails.limit,
      page: this.pagination.emails.page,
      corporatePackage: this.editId,
    }
    this.spinner.show();
    this.corporateService.getEmailsList(params).subscribe((res: any) => {
      this.spinner.hide();
      this.pagination.emails.total = res.count || 0;
      this.emails = res.data;
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });

  }

  getDiagnosticPackages() {
    let { page, limit } = this.pagination.diagnostics

    let data = {
      corporatePackageId: this.editId,
      page: page,
      limit: limit
    }

    this.diagnosticService.getCorporateDiagnosticPackages(data).subscribe(res => {
      let { data, total } = res;
      this.pagination.diagnostics.total = total;
      this.diagnosticPackages = data;
    }, (err: HttpErrorResponse) => {

    })
  }

  getCampCollectionList() {
    let { page, limit } = this.pagination.camp

    let data = {
      page: page,
      limit: limit,
      corporatePackageId: this.editId
    }

    this.diagnosticService.getCampCollectionList(data).subscribe(res => {
      let { data, total } = res;

      this.campCollectionList = data;
      this.pagination.camp.total = total;
    }, (err: HttpErrorResponse) => {

    })
  }

  deleteLifestyle(data, index) {

    if (!confirm(`Are you sure you want to delete \"${data.lifestyleTip.title}\" lifestyle`)) return;

    this.corporateService.deleteLifestyleTip(data._id).subscribe(res => {
      if (res.success) {
        this.toaster.success('Camp Collection Deleted Successfully');
        this.lifestyleTips.splice(index, 1);
      }
    }, (err: HttpErrorResponse) => {
      this.toaster.error(err.error?.message || 'Something went wrong')
    })
  }

  deleteWebinar(data, index) {

    if (!confirm(`Are you sure you want to delete \"${data.webinarId.title}\" webinar`)) return;

    this.corporateService.deleteCorporateWebinar(data._id).subscribe(res => {
      if (res.success) {
        this.toaster.success('Camp Collection Deleted Successfully');
        this.webinars.splice(index, 1);
      }
    }, (err: HttpErrorResponse) => {
      this.toaster.error(err.error?.message || 'Something went wrong')
    })
  }

  deleteEmailLog(data, index) {

    if (!confirm(`Are you sure you want to delete \"${data.subject}\" email log`)) return;

    this.corporateService.deleteEmail(data._id).subscribe(res => {
      if (res.success) {
        this.toaster.success('Camp Collection Deleted Successfully');
        this.emails.splice(index, 1);
      }
    }, (err: HttpErrorResponse) => {
      this.toaster.error(err.error?.message || 'Something went wrong')
    })
  }

  deleteCampCollection(data, index) {
    if (!confirm(`Are you sure you want to delete \"${data.title}\" camp`)) return;

    this.diagnosticService.deleteCampCollection(data._id).subscribe(res => {
      if (res.success) {
        this.toaster.success('Camp Collection Deleted Successfully');
        this.campCollectionList.splice(index, 1);
      }
    }, (err: HttpErrorResponse) => {
      this.toaster.error(err.error?.message || 'Something went wrong')
    })
  }

  deleteDiagnosticPackage(data, index) {
    if (!confirm(`Are you sure you want to delete \"${data.title}\" diagnostic package`)) return;

    this.diagnosticService.deleteCorporateDiagnosticPackage(data._id).subscribe(res => {
      if (res.success) {
        this.toaster.success('Diagnostic Package Deleted Successfully');
        this.diagnosticPackages.splice(index, 1);
      }
    }, (err: HttpErrorResponse) => {
      this.toaster.error(err.error?.message || 'Something went wrong')
    })
  }

  onChangeConsultantType() {

    this.searchConsultants(this.lastConsultantSearch);
  }

  onSearchConsultants(event) {
    this.searchConsultants$.next(event.target.value)
  }

  searchConsultants(val: string = '') {
    let { consultantType } = this.form.value;
    this.lastConsultantSearch = val;
    this.contactsService.searchConsultants(val, consultantType).subscribe(res => {
      this.consultants = res.data
    }, (err: HttpErrorResponse) => {

    });
  }

  calculate(type: 'discount' | 'sp' | 'cp' | 'margin') {
    const formValue = this.form.value;
    const priceValue = (formValue as any).price || { mrp: 0, sellingPrice: 0, discount: 0 };
    
    let costPrice = Number(formValue.costPrice) || 0;
    let margin = Number(formValue.margin) || 0;
    let mrp = Number(priceValue.mrp) || 0;
    let sellingPrice = Number(priceValue.sellingPrice) || 0;
    let discount = Number(priceValue.discount) || 0;

    if (!mrp && ['discount', 'sp'].includes(type)) {
      this.toaster.error('MRP is required to auto calculate SP or discount')
    }
    if (['cp', 'margin'].includes(type) && !sellingPrice) {
      this.toaster.error('Selling Price is required to auto calculate CP or margin')
    }

    const priceForm = this.form.controls.price;

    switch (type) {
      case 'discount':
        discount = (mrp - sellingPrice) / (mrp || 1) * 100;
        priceForm.get('discount')?.setValue(isFinite(discount) ? discount : 0);
        break;
      case 'sp':
        sellingPrice = mrp - (mrp * (discount / 100))
        if (!discount) {
          sellingPrice = mrp;
        }
        priceForm.get('sellingPrice')?.setValue(isFinite(sellingPrice) ? (sellingPrice as any) : (mrp as any));
        break;
      case 'cp':
        costPrice = sellingPrice - (sellingPrice * (margin / 100))
        if (!margin) {
          costPrice = sellingPrice;
        }
        this.form.get('costPrice')?.setValue(isFinite(costPrice) ? (costPrice as any) : (mrp as any));
        break;
      case 'margin':
        margin = (sellingPrice - costPrice) / (sellingPrice || 1) * 100;
        this.form.get('margin')?.setValue(isFinite(margin) ? (margin as any) : 0);
        break;
    }
  }

  onDeleteDiagnosticBooking(data, index) {
    if (confirm(`Are you sure you want to delete ${data.orderBy}'s booking?`)) {
      this.spinner.show()
      this.diagnosticService.deleteBooking(data._id).subscribe(res => {
        this.spinner.hide()
        let { success } = res;
        if (success) {
          this.bookings.splice(index, 1)
          this.toaster.success('Booking deleted successfully');
        }
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toaster.error(err.error?.message || 'Something went wrong!')
      })
    }
  }

  pageChanged(type: string) {
    switch (type) {
      case 'lifestyleTips': this.getLifestyleTipsList(); break;
      case 'webinars': this.getWebinarsList(); break;
      case 'emails': this.getEmailsList(); break;
      case 'diagnostics': this.getDiagnosticPackages(); break;
      case 'camp': this.getCampCollectionList(); break;
    }
  }

  openModal(modal, campData) {
    this.modalService.open(modal, { size: 'xl', scrollable: true });

    this.spinner.show()
    this.diagnosticService.getDiagnosticBookings({ campId: campData._id }).subscribe(res => {
      this.spinner.hide()
      let { success, data } = res;
      if (success && data) {
        this.bookings = data;

      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })
  }

  trimInput(input) {
    trimInputValue(input)
  }

  goBackToList() {
    this.router.navigateByUrl('/admin/corporate/packages');
  }
}
