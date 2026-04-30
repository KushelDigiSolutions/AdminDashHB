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
import { productList } from '../../product.model';
import { Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
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
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit, OnDestroy {

  subsArr: Subscription[] = [];

  set setSubscriptions$(subs: Subscription) {
    this.subsArr.push(subs)
  }

  get subscriptions$(): Subscription[] {
    return this.subsArr;
  }


  debouncer: any;

  imageUrl = environment.imageUrl;
  breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Orders' }, { label: 'Create Order', active: true }];
  productList: any[] = [];
  selectedProduct: any;
  selectedProducts: any[] = [];
  selectedUser: any;
  selectedAddress = -1;
  newAddress = false;
  qty = 1;
  activeTab = 1;

  userList: any[] = [];
  subOrder: any;

  checkoutData: any;
  appliedCoupon = {
    code: '',
    discount: 0,
    totalPayableAmount: 0
  }

  orderFormGroup = this.fb.group({
    orderType: ['newOrder'],
    parentOrderId: [{ value: '', disabled: true }, Validators.required],
  });

  guestUserFormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email: [''],
    phone: ['', Validators.required],
    houseNumber: ['', Validators.required],
    line1: ['', Validators.required],
    pinCode: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    landmark: [''],
    addressType: ['home'],
  });

  regsUserFormGroup = this.fb.group({
    phone: ['']
  });

  userFormGroup = this.fb.group({
    userType: ['guest'],
    guestUser: this.guestUserFormGroup,
    regsUser: this.regsUserFormGroup
  });

  paymentFormGroup = this.fb.group({
    paymentType: ['prepaid'],
    paymentDetails: this.fb.group({
      paymentMethod: ['', Validators.required],
      txnId: [''],
      paymentDate: ['', Validators.required],
      paymentType: ['offline']
    })
  });

  constructor(
    private api: EcommerceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userFormGroup.get('regsUser').disable();
    this.searchOrder();
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(subs => subs.unsubscribe());
  }

  searchOrder() {
    this.setSubscriptions$ = this.orderFormGroup.get('parentOrderId').valueChanges
      .pipe(debounceTime(500))
      .subscribe(_id => {
        if (this.orderFormGroup.value.orderType == 'newOrder' || (this.subOrder && this.subOrder._id == _id)) return;

        this.subOrder = null;
        this.selectedAddress = -1;

        if (_id && (_id = _id.trim())) {
          let params = { limit: 10, page: 1, _id };
          this.api.getOrdersList(params).subscribe((res: any) => {
            let order = res.data.orders.find(el => el._id == _id);
            if (order) {
              this.subOrder = order;
              this.toastr.success('Order found successfully');
            } else {
              this.toastr.error('Order not found!');
            }
          }, err => {
            this.toastr.error('Invalid order ID!');
          })
        }
      });
  }

  onChangeOrderType() {
    let control = this.orderFormGroup.get('parentOrderId');
    if (this.orderFormGroup.value.orderType == 'newOrder') {
      control.disable();
    } else {
      control.enable();
    }
    console.log(control);

  }
  searchProducts(event) {

    if (this.debouncer) {
      clearInterval(this.debouncer)
    }
    this.debouncer = setTimeout(x => {
      let { value } = event.target;
      this.productList
      if (value && value.trim()) {
        this.api.algoliaSearch(value.trim()).subscribe(res => {
          if (res.success) {
            this.productList = res.data1.hits;
          }
        }, err => {

        });
      }
    }, 400)

  }

  onSelectProduct(event) {
    if (!event) return;
    console.log(event);
    this.qty = 1;
    let product = JSON.parse(JSON.stringify(event));
    this.selectedProduct = product;

    if (product.type == 'Normal' && product.variations.length) {
      product.variations.sort((a, b) => (a.price.minPrice || a.price.mrp) - (b.price.minPrice || a.price.mrp));
      let variation = product.variations[0];
      // product._id = variation.productId;
      // product.price = variation.price;
      // product.weight = variation.weight;
      // product.slug = variation.slug;
    }
    if (product.mainVariations.length && product.variations.length) {
      product.mainVariations = product.mainVariations.filter(el => !!el.values.length)
      product.variations = product.variations.filter(el => !!el.label.length)
      if (product.mainVariations.length && product.variations.length) {
        let maxGroupSize = product.mainVariations.map(el => el.values.length).reduce((total, el) => total * el) || 0;

        this.addTitleInVariations(product);

        if (product.variations.length != maxGroupSize) {
          product.variationsStructureType = 'group'
        } else {
          product.variationsStructureType = 'single'
        }

        console.log('[maxGroupSize]', maxGroupSize, product.variations.length, product.variations);
        this.makeDefaultVariantsSelected(product);
      }

    }


  }

  makeDefaultVariantsSelected(product) {
    if (!product.mainVariations.length || !product.variations.length) return;

    let currentGroup = product.variations.find(el => '/' + product.slug == el.url);

    if (currentGroup) { /** if product type is variant */
      currentGroup.isSelected = true;
      let labelArr = currentGroup.label;
      labelArr.forEach(label => {
        product.mainVariations.forEach(el => {
          let index = el.values.indexOf(label)
          if (index != -1) {
            el.selectedIndex = index;
          }
        });
      })
      product.selectedVariation = currentGroup;
    } else { /** if product type is normal */
      product.variations[0].isSelected = true;
      let selectedValue = [];

      let labelArr = product.variations[0].label;
      labelArr.forEach(label => {
        product.mainVariations.forEach(el => {
          let index = el.values.indexOf(label)
          if (index != -1) {
            el.selectedIndex = index;
            selectedValue.push(el.values[index])
          }
        });
      })

      // product.mainVariations.forEach(el => {
      //   selectedValue.push(el.values[0])
      //   el.selectedIndex = 0;
      // });

      if (product.variationsStructureType == 'group') {
        var group = product.variations[0]
      } else {
        group = product.variations.find(el => this.checkIsSameGroup(selectedValue, el.label))
      }
      product.selectedVariation = group;
      product = {
        ...product,
        _id: group.productId,
        weight: group.weight,
        price: group.price,
        slug: group.slug,
        stock: group.stock,
        noOfProductSold: group.noOfProductSold,
      }
      this.selectedProduct = { ...product };
    }
  }
  addTitleInVariations(product) {
    if (!(product.variations && product.mainVariations)) return;
    product.variations.forEach(el => {
      el.title = [];
      el.label.forEach(label => {
        product.mainVariations.forEach(mVariation => {
          if (typeof mVariation.variationId != 'object')
            console.error("Custom Error: Cannot read property 'title' of variationId");
          if (mVariation.values.includes(label)) {
            el.title.push(mVariation.variationId.title || "Unknown")
          }
        });
      });
    });
  }

  checkIsSameGroup(values1: string[], values2: string[]): boolean {
    let set = new Set();
    values1.forEach(el => set.add(el));
    values2.forEach(el => set.add(el));
    return values1.length == set.size;
  }

  selectVariation(product, variation, index?) {
    let selectedVariation;
    if (product.variationsStructureType == 'group') {
      product.variations.forEach(el => {
        el.isSelected = false;
      });
      variation.isSelected = true;
      selectedVariation = variation;
    } else {
      variation.selectedIndex = index;
      let selectedValues = [];
      product.mainVariations.forEach(mVariation => {
        selectedValues.push(mVariation.values[mVariation.selectedIndex]);
      });

      selectedVariation = product.variations.find(el => this.checkIsSameGroup(selectedValues, el.label));
    }

    product = {
      ...product,
      _id: selectedVariation.productId,
      weight: selectedVariation.weight,
      price: selectedVariation.price,
      slug: selectedVariation.slug,
      stock: selectedVariation.stock,
      noOfProductSold: selectedVariation.noOfProductSold,
      selectedVariation,
    }
    this.selectedProduct = product;
    console.log(this.selectedProduct);

  }

  changeQty(type) {
    if (type == 'plus') {
      this.qty += 1;
    } else {
      if (this.qty == 1) return;
      this.qty -= 1;
    }
  }

  addProduct() {
    let index = this.selectedProducts.findIndex(el => el.productId == this.selectedProduct._id);
    if (index == -1) {
      this.selectedProducts.push({
        product: this.selectedProduct,
        qty: this.qty,
        productId: this.selectedProduct._id
      });
    } else {
      this.selectedProducts[index].qty += this.qty;
    }
  }

  deleteProduct(i) {
    this.selectedProducts.splice(i, 1);
  }

  onChangeUserType() {
    let { userType } = this.userFormGroup.value;
    if (userType == 'guest') {
      this.userFormGroup.get('guestUser').enable();
      this.userFormGroup.get('regsUser').disable();
    } else {
      !this.newAddress && this.userFormGroup.get('guestUser').disable();
      this.userFormGroup.get('regsUser').enable();
    }
  }

  searchUsers(event) {
    let { value } = event.target;
    if (value) {
      value = value.trim().replaceAll(' ', '');
      if (value.length > 4) {
        value = value.indexOf('+91') == 0 ? value.substr(3) : value;
        this.api.getUserList({ userIdentifier: value }).subscribe((res: any) => {
          this.userList = res.data;
        }, err => {

        });
      }

    }
  }

  onSelectUser(event) {
    console.log(event);
    event.address = event.address.map(address => {
      address.fullAddress = ['houseNumber', 'line1', 'city', 'state', 'country'].map(key => address[key] || '').reduce((arr, el1) => {
        if (el1) arr.push(el1);
        return arr;
      }, []).join(', ');
      return address;
    });
    this.selectedUser = event;
  }

  getUserAddressArea() {
    let { pinCode } = this.guestUserFormGroup.value;
    this.spinner.show();
    this.api.getUserAddressArea(pinCode).subscribe((res: any) => {
      this.spinner.hide();
      let area = res.data[0];
      if (area) {
        this.guestUserFormGroup.patchValue({
          country: 'India',
          state: area.stateName,
          city: area.districtName
        });
      } else {
        this.toastr.error('Invalid pincode')
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong');
    })
  }

  addNewAddress() {
    this.userFormGroup.get('guestUser').enable();
    this.selectedAddress = -1;
    this.newAddress = true;
  }

  onChangePaymentType() {
    if (this.appliedCoupon.code) {
      this.toastr.info('Please apply again.', 'Coupon has been removed!');
      this.removeCoupon();
    }
    let control = this.paymentFormGroup.get('paymentDetails')
    let { paymentType } = this.paymentFormGroup.value;
    if (paymentType == 'prepaid') {
      control.enable();
    } else {
      control.disable();
    }
    this.calculatePricing();
  }

  onChangePaymentMethod() {
    this.calculatePricing();
  }

  getGuestBillingInfo() {
    let { guestUser } = this.userFormGroup.value;
    let billingInfo = {
      firstName: guestUser.firstName,
      lastName: guestUser.lastName,
      email: guestUser.email,
      countryCode: '+91',
      phone: guestUser.phone,
      address: {
        country: guestUser.country,
        line1: guestUser.line1,
        line2: "",
        landmark: guestUser.landmark || '',
        city: guestUser.city,
        state: guestUser.state,
        pinCode: guestUser.pinCode,
        houseNumber: guestUser.houseNumber
      },
    }

    return billingInfo;
  }

  calculatePricing() {
    var pincode;
    if (this.userFormGroup.value.userType == 'guest') {
      pincode = this.userFormGroup.value.guestUser.pinCode
    } else {
      if (this.selectedAddress == -1) {
        pincode = this.userFormGroup.value.guestUser.pinCode
      } else {
        pincode = this.selectedUser.address[this.selectedAddress].pinCode
      }
    }
    if (this.orderFormGroup.invalid) {
      this.next(1)
      this.toastr.error('Please fill out the required fields');
      return;
    } else if (!this.selectedProducts.length) {
      this.next(1)
      this.toastr.error('Please select the products');
      return;
    } else if (!pincode) {
      this.next(2)
      this.toastr.error('Please fill out the required fields');
      return;
    }
    let { paymentType, paymentDetails } = this.paymentFormGroup.value;

    let data: any = {
      pincode,
      paymentMethod: paymentType,
      products: this.selectedProducts.map(product => {
        let orderProduct: any = {
          productId: product.productId,
          quantity: product.qty,
          weight: product.product.weight,
          slug: product.product.slug,
        }
        if (product.product.selectedVariation) {
          orderProduct.label = product.product.selectedVariation.label
        }
        return orderProduct;
      })
    }
    if (paymentType == 'prepaid' && paymentDetails?.paymentMethod == "cod") {
      data.isCOD = true
    }
    this.spinner.show();
    this.api.adminCheckout(data).subscribe((res: any) => {
      this.spinner.hide()
      if (res.success) {
        this.checkoutData = res.data;

      }

    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong')
    })
  }

  onCouponApply(couponForm) {
    this.checkoutData
    let data = {
      code: couponForm.value.code,
      totalPayableAmount: this.checkoutData.totalPayableAmt
    }
    this.spinner.show();
    this.api.applyCoupon(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status) {
        this.toastr.success('Coupon applied successfully')
        this.appliedCoupon = {
          code: data.code,
          discount: res.data.discount,
          totalPayableAmount: res.data.totalPayableAmount
        }
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.toastr.error(err.error.message);
    })
  }

  removeCoupon() {
    this.appliedCoupon = {
      code: '',
      discount: 0,
      totalPayableAmount: 0,
    }
  }

  getCeilValue(value: number) {
    return Math.ceil(value)
  }

  onCreateOrder(): void {

    if (!this.selectedProducts.length) {
      this.activeTab = 1;
      this.toastr.error('Please select products first.'); return;
    }

    let orderFGValue = this.orderFormGroup.value;
    let userFGValue = this.userFormGroup.value;

    var orderData: any = {
      orderType: orderFGValue.orderType,
      products: this.selectedProducts.map(product => {
        let orderProduct: any = {
          productId: product.productId,
          quantity: product.qty,
          weight: product.product.weight,
        }
        if (product.product.selectedVariation) {
          orderProduct.label = product.product.selectedVariation.label
        }
        return orderProduct;
      }),
      billingInfo: {},
      shippingInfo: {},
      paymentCallbackUrl: environment.userAppHost + 'payments'
    };

    if (this.appliedCoupon.code) {
      orderData.couponCode = this.appliedCoupon.code;
    }

    if (orderFGValue.orderType == 'subOrder') {
      if (!this.subOrder) this.toastr.error('Invalid sub order ID'); return;
      orderData.parentOrderId = orderFGValue.parentOrderId
    }

    if (this.userFormGroup.invalid) {
      this.activeTab = 2;
      this.toastr.error('Please fill all required fields'); return;
    }

    var billingInfo: any;
    if (userFGValue.userType == 'guest') {
      billingInfo = this.getGuestBillingInfo();
      orderData.userInfo = billingInfo.phone
    } else {
      if (!this.selectedUser) this.toastr.error('Invalid registered phone number'); return;

      orderData.userInfo = this.selectedUser.phone;

      if (this.selectedAddress == -1) {
        if (!this.newAddress || this.userFormGroup.invalid) {
          this.activeTab = 2;
          this.toastr.error('Please select user address or create new one'); return;
        }
      }
      if (this.newAddress) {
        billingInfo = this.getGuestBillingInfo();
      } else {
        let address = this.selectedUser.address[this.selectedAddress];
        billingInfo = {
          firstName: address.name,
          lastName: address.lastName || '',
          email: address.email || '',
          countryCode: '+91',
          phone: address.phoneNo,
          address: {
            country: address.country,
            line1: address.line1,
            line2: "",
            landmark: address.landmark || '',
            city: address.city,
            state: address.state,
            pinCode: address.pinCode,
            houseNumber: address.houseNumber
          },
        }
      }
    }
    orderData.billingInfo = billingInfo;
    orderData.shippingInfo = billingInfo;

    let { paymentType, paymentDetails } = this.paymentFormGroup.value;
    orderData.adminPaymentStatus = paymentType;
    if (paymentType == 'prepaid') {
      orderData.paymentInfo = paymentDetails
    } else if (paymentType == 'paymentLink') {
      orderData.paymentCallbackUrl = environment.userAppHost + 'payments';
    }

    console.log(orderData);

    this.spinner.show();
    this.api.createOrder(orderData).subscribe((res: any) => {
      this.spinner.hide();
      if (res.success) {
        this.toastr.success('Order created successfully');
        if (res.data.adminPaymentStatus == 'paymentLink') {
          this.router.navigate(['/ecommerce/orders/order-detail', res.data._id], { queryParams: { showPaymentLink: true } });
        } else {
          this.router.navigateByUrl('/ecommerce/orders');
        }
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong.')
    })
  }

  next(step) {
    switch (step) {
      case 1: {
        this.activeTab = 1;
        break;
      }
      case 2: {
        this.activeTab = 2;
        break;
      }
      case 3: {
        this.activeTab = 3;
        this.calculatePricing();
        break;
      }
    }
  }

}
