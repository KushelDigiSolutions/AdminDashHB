import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ToastService } from 'src/app/core/services/toast.service';
import { DiagnosticsService } from 'src/app/pages/diagnostics/diagnostics.service';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';

@Component({
  standalone: false,
  selector: 'app-create-health-package-subscription',
  templateUrl: './create-health-package-subscription.component.html',
  styleUrls: ['./create-health-package-subscription.component.scss']
})
export class CreateHealthPackageSubscriptionComponent implements OnInit {

  breadCrumbItems = [
    { label: "Home" },
    { label: "Subscriptions" },
    { label: "Create", active: true },
  ];

  private search$ = new Subject<{ value: string, type: string }>();
  userList = [];
  HealthPackageList = [];
  variations = []
  consultants = []
  labTests = []

  selectedVariation: any = {}
  selectedLabTests = []
  labTestsSP: any = ''
  isPincodeServiceable = -1

  paymentMethod = [
    "cash",
    "payZapp",
    "freeRecharge",
    "card",
    "netBanking",
    "upi",
    "paytm",
    "phonePe",
    "freecharge",
    "olaMoney",
    "airtel",
    "oxigen",
  ];

  form = this.fb.group({
    userId: [null, Validators.required],
    healthPackageId: [null, Validators.required],
    variationId: [null],
    consultant: [null, Validators.required],
    pincode: [''],
    testsId: [[]],
    healthPackagePrice: ['', [Validators.required, Validators.min(0)]],
    adminPaymentStatus: ['prepaid'],
    paymentType: [''],
    paymentMethod: ['', Validators.required],
    paymentDate: [''],
    txnId: [''],
  });
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private eCommerceService: EcommerceService,
    private diagnosticsService: DiagnosticsService,
    private spinner: NgxSpinnerService,
    private toast: ToastService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.search$.pipe(debounceTime(500)).subscribe(({ value, type }) => {
      if (value) {
        switch (type) {
          case 'user': {
            this.searchUsers(value)
            break;
          }
          case 'healthPackage': {
            this.searchHealthPackage(value)
            break;
          }
        }


      }
    });
  }

  get f() {
    return this.form.controls
  }

  search(event: any, type: string) {
    let { value } = event.target;
    this.search$.next({ value, type });
  }

  searchUsers(value: string) {
    value = value.trim().replace(/ /g, '');
    if (value.length > 4) {
      value = value.indexOf('+91') == 0 ? value.slice(3) : value;
      let data = {
        userIdentifier: value,
        active: true,
      }
      this.eCommerceService.getUserList(data).subscribe((res: any) => {
        this.userList = res.data;
      }, err => {

      });
    }
  }

  searchHealthPackage(value: string) {
    this.eCommerceService.searchHealthPackages({ keyword: value }).subscribe(res => {
      let { data } = res
      this.HealthPackageList = data;

    }, (err: HttpErrorResponse) => {

    })
  }

  onChangeHealthPackage() {
    this.labTestsSP = 0;
    this.isPincodeServiceable = -1;
    this.form.patchValue({ variationId: null, testsId: [] as any });

    let { healthPackageId } = this.form.value
    if (healthPackageId) {
      let healthPackage = this.HealthPackageList.find(el => el._id == healthPackageId),
        { duration, price, consultants, diagnosticPackages } = healthPackage;

      this.variations = [{ _id: null, duration, price }, ...healthPackage.variations]
      this.consultants = consultants.map(el => {
        el.name = `${el.firstName || ''} ${el.lastName || ''}`
        el.consultantTypes = el.consultantType.map(el => el.name).join(', ')
        return el;
      })
      this.labTests = diagnosticPackages.packagesId || []

      console.log({ healthPackage, variations: this.variations });
    }

  }

  onChangeVariation() {
    let { variationId } = this.form.value
    let variation = this.variations.find(el => el._id == variationId)
    this.selectedVariation = {}
    if (variation) {
      let { sellingPrice } = variation.price
      this.form.patchValue({
        healthPackagePrice: sellingPrice
      })
      this.selectedVariation = variation

    }
  }

  onChangePincode() {
    this.isPincodeServiceable = -1;
  }

  checkPincode() {
    let { pincode } = this.form.value
    if (pincode?.trim()) {
      this.spinner.show()
      this.diagnosticsService.checkPincodeAvailability(pincode.trim()).subscribe(res => {
        this.spinner.hide()
        let { data, success } = res;
        if (success && data && data.status === "Y") {
          this.isPincodeServiceable = 1
        } else {
          this.isPincodeServiceable = 0
        }
      }, (err => {
        this.spinner.hide()
        if (err.error?.message == "Sorry..! Currently we are not serving this pincode.") {
          this.isPincodeServiceable = 0;
        } else {
          this.toast.error(err.error?.message || 'Something went wrong');
          this.isPincodeServiceable = -1;
        }
      }))
    }
  }

  onChangeLabTests() {
    const testsId = this.form.value.testsId;
    this.selectedLabTests = (testsId as any) ? this.labTests.filter(el => (testsId as any).includes(el._id)) : [];
    this.labTestsSP = this.selectedLabTests.reduce((total, el) => {
      return total + (el.rate?.b2C || 0)
    }, 0)

  }

  onChangePaymentType() {
    let { adminPaymentStatus } = this.form.value
    if (adminPaymentStatus == 'prepaid') {
      this.f.paymentMethod.enable()
    } else {
      this.f.paymentMethod.disable()
    }
  }

  onSubmit() {
    let { value, valid } = this.form as any;
    this.submitted = true

    if (valid && value.testsId && value.testsId.length && this.isPincodeServiceable === 0) {
      return this.toast.error('Please try another pincode or remove the lab tests.')
    }
    if (valid && (value.testsId && value.testsId.length ? this.isPincodeServiceable === 1 : true)) {
      console.log('[if block]');
      value = { ...value }
      if (value.adminPaymentStatus == 'prepaid') {
        value.paymentType = 'offline'
      }
      for (let key in value) {
        if (!value[key]) delete value[key]
      }
      this.spinner.show()
      this.eCommerceService.createHealthPackageSubscription(value).subscribe(res => {
        this.spinner.hide()
        this.router.navigate(['/subscribed-health-packages'])
        this.toast.success('Subscription created successfully')
      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toast.error(err.error?.message)
      })

    }
  }
}
