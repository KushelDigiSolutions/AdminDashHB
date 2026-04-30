import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  NgbDate,
  NgbDatepickerNavigateEvent,
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { currentDate, getFormatedDate, time24to12 } from 'src/app/util/date.util';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { searchHits } from './searchhits';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { DeleteModalComponent } from 'src/app/pages/consultation/modals/delete-modal/delete-modal.component';
import { ConsultationService } from 'src/app/pages/consultation/consultation.service';
import { PdfService } from 'src/app/core/services/pdf.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewPrescriptionComponent } from '../view-prescription/view-prescription.component';
import { ViewMedicalRecordComponent } from '../view-medical-record/view-medical-record.component';

@Component({
  standalone: false,
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.scss'],
})
export class ViewAppointmentComponent implements OnInit {
  @ViewChild('scheduleModal') scheduleModal: ElementRef;
  @ViewChild('variationModal') variationModal: ElementRef;
  @ViewChild('medicalRecordModal') medicalRecordModal: ElementRef;
  @ViewChild('prescriptionModal') prescriptionModal: ElementRef;
  @ViewChild('medicalAttachmentModal') medicalAttachmentModal: ElementRef;
  @ViewChild(ViewPrescriptionComponent) viewPrescriptionElem: ViewPrescriptionComponent;
  @ViewChild(ViewMedicalRecordComponent) viewMedicalRecordElem: ViewMedicalRecordComponent;

  openModalRef: NgbModalRef;
  isAdmin: boolean;
  isConsultant: boolean;
  consultantId: string;
  imageUrl = environment.imageUrl;
  breadCrumbItems = [{ label: 'Appointments' }, { label: 'Appointment', active: true }];
  activeTab = 1;
  apptData;
  followUps: any[] = [];

  productList: any[] = [];
  qty: number;
  selectedProduct: any;
  selectedProducts = [];
  vitals = [
    { name: 'Ht', unit: '(Cms)' },
    { name: 'Wt', unit: '(Kg)' },
    { name: 'Pulse', unit: '/ min' },
    { name: 'BP', unit: 'mm/Hg' },
    { name: 'Temp', unit: '°F' },
    { name: 'RR', unit: '/ min' },
    { name: 'SPO2', unit: '%' },
  ];
  investigations = [
    'CBC',
    'B Suger F',
    'B Suger PP',
    'HbA1c',
    'T3',
    'T4',
    'TSH',
    'FSH',
    'LH',
    'Prolactin',
    'LFT',
    'KFT',
    'Urin R/M',
    'Lipid Profile',
    'X Ray Chest PA View',
    'USG Abdomen',
    'ECG',
    'ECHO',
    'EGG',
  ];
  history = [
    'Hyper Tension',
    'Diabetes',
    'COPD',
    'Oncology',
    'CAD',
    'Tuberculosis',
    'Thyroid',
    'Surgery',
    'Other',
  ];

  timings = ['Morning', 'Afternoon', 'Evening', 'Night'];
  takeDosage = ['Before Meal', 'With Meal', 'After Meal', 'SOS', 'None'];
  debouncer: any;
  prescriptionModalData: any;

  prescriptionsCount = 0;
  medicalRecordsCount = 0;
  prescriptionList = [];
  medicalRecordList = [];

  activeModalData: { type: 'reschedule' | 'followUp'; apptId: string } = {
    type: 'reschedule',
    apptId: '',
  };
  modalData = {
    reschedule: {
      title: 'Reschedule Apptointment',
    },
    followUp: {
      title: 'Create Follow Up',
    },
    status: {
      title: 'Update Status',
    },
  };
  currentDate = currentDate();
  minDate: NgbDateStruct = {
    year: new Date(this.currentDate).getFullYear(),
    month: new Date(this.currentDate).getMonth() + 1,
    day: new Date(this.currentDate).getDate(),
  };

  public Editor = ClassicEditor;
  writePrescription = false;

  submit = {
    pres: false,
  };
  form = this.fb.group({
    title: ['', Validators.required],
    chiefComplaints: [''],
    examination: [''],
    treatment: [''],
    investigations: this.fb.array(this.investigations.map((_) => !1)),
    pastHistory: this.fb.array(this.history.map((_) => !1)),
    otherPastHistory: [''],
    appetite: [''],
    vitals: this.fb.array(this.vitals.map((_) => '')),
    medicines: this.fb.array([this.createMedicineFG()]),
    note: [''],
  });

  apptScheduleForm = this.fb.group({
    date: [this.minDate, Validators.required],
    primaryTimeSlot: ['', Validators.required],
  });

  recordForm = this.fb.group({
    date: [currentDate(), Validators.required],
    description: [''],
    attachment: ['', Validators.required],
  });

  appointmentId: string;

  selectedMedicineFG: FormGroup;
  pagination = {
    prescription: {
      page: 1,
      limit: 10,
    },
    records: {
      page: 1,
      limit: 10,
    },
  };
  page = 1;
  limit = 10;

  slotsData = {
    year: null,
    month: null,
    timeSlots: [],
  };
  selectedTimeSlot = { date: '', slots: [] };

  showDropdown: boolean = false;

  currentOpenedAttachment: any = '';
  currentOpenedAttachmentType: any = '';
  showImageBlock = true;
  callDetails = {};

  constructor(
    private apiService: ApiService,
    private eService: EcommerceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private consultationService: ConsultationService,
    private pdf: PdfService,
    private sanitizer: DomSanitizer,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUser().role.includes('Admin');
    this.isConsultant = this.authService.currentUser().role.includes('Consultant');

    if (this.route.snapshot.queryParams.view == 'followUp') {
      this.activeTab = 2;
    }
    this.route.params.subscribe((res: any) => {
      this.appointmentId = res.id;
    });

    this.getDetails();
    this.getPrescriptions();
    this.getMedicalRecords();
  }

  getDetails() {
    this.spinner.show();
    forkJoin([
      this.apiService.get(`appointments/detail?_id=${this.appointmentId}`),
      this.apiService.get(`appointments/followups?parentAppointmentId=${this.appointmentId}`),
    ]).subscribe(
      (res: any) => {
        this.spinner.hide();
        let { data } = res[0];
        if (data) {
          this.consultantId = data.consultantId?._id;
          this.apptData = data;
          this.followUps = res[1].data.appointments;
          this.cdr.markForCheck();
        } else {
          this.toastr.error('Appointment not found!');
          this.router.navigate(['/consultation/appointment'], {
            replaceUrl: true,
          });
        }
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Something went wrong');
      },
    );
  }
  getPrescriptions() {
    let { page, limit } = this.pagination.prescription;
    let params = {
      appointmentId: this.appointmentId,
      page,
      limit,
    };

    this.consultationService.getAppointmentPrescriptionList(params).subscribe(
      (res: any) => {
        this.prescriptionsCount = res.count;
        this.prescriptionList = [...this.prescriptionList, ...res.data];
      },
      (err: HttpErrorResponse) => {
        console.log('err', err);
      },
    );
  }

  loadMorePrescription() {
    this.pagination.prescription.page++;
    this.getPrescriptions();
  }

  getMedicalRecords() {
    let { page, limit } = this.pagination.records;
    this.apiService
      .get(`medicalrecords?appointmentId=${this.appointmentId}&page=${page}&limit=${limit}`)
      .subscribe(
        (res: any) => {
          this.medicalRecordsCount = res.count;
          this.medicalRecordList = [...this.medicalRecordList, ...res.data];
        },
        (err: HttpErrorResponse) => {
          console.log('err', err);
        },
      );
  }

  loadMoreRecords() {
    this.pagination.records.page++;
    this.getMedicalRecords();
  }

  // onAddProduct(data) {
  //   let index = this.selectedProducts.findIndex(el => el.productId == data.product._id);
  //   if (index == -1) {
  //     this.selectedProducts.push({
  //       product: data.product,
  //       qty: data.qty,
  //       productId: data.product._id
  //     });
  //   } else {
  //     this.selectedProducts[index].qty += data.qty;
  //   }
  // }

  updateProduct(modal: any) {
    let { _id, name, slug, selectedVariation } = this.selectedProduct;
    this.setProductValue(this.selectedMedicineFG, {
      data: this.selectedProduct,
      qty: this.qty,
    });
    modal.dismiss('Cross click');
    console.log(this.selectedMedicineFG);
  }

  deleteProduct(i) {
    this.selectedProducts.splice(i, 1);
  }

  openModal(content: any, type: 'reschedule' | 'followUp', appt): void {
    let followUp = this.followUps.find(
      (el) => el.status == 'Confirmed' || el.status == 'Re-scheduled',
    );

    if (type == 'followUp' && appt.status != 'Completed') {
      this.toastr.info('Please mark completed the appointment first');
      return;
    } else if (followUp && followUp._id != appt._id) {
      this.activeTab = 2;
      this.toastr.info('Please mark completed the follow-up appointment first');
      return;
    }
    this.activeModalData = { type, apptId: appt._id };
    this.openModalRef = this.modalService.open(content, { windowClass: 'modal-holder' });
    let { year, month, day } = this.apptScheduleForm.value.date as any;

    this.getAvailableSlots(
      `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`,
    );
  }

  // onChangeMonth(event: NgbDatepickerNavigateEvent) {
  //   let { month, year } = event.next;
  //   this.slotsData.year
  //   this.slotsData.month
  //   if (year == this.slotsData.year && month == this.slotsData.month) return;
  //   this.getAvailableSlots(`${year}-${month < 10 ? '0' + month : month}-01`);
  // }

  onDateSelect(date: NgbDate) {
    console.log('DATE', date);
    this.apptScheduleForm.patchValue({ date: date });
    let { year, month, day } = this.apptScheduleForm.value.date;
    let newDate: any = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    this.getAvailableSlots(newDate);
    // this.setSelectedDateSlots()
  }

  getAvailableSlots(startDate: string) {
    // var date = new Date(startDate)
    // , y = date.getFullYear(), m = date.getMonth();
    // let endDate = getFormatedDate(new Date(y, m + 1, 0));

    const queryParams: any = {
      consultantId: this.consultantId,
      startDate,
      // endDate
    };

    console.log('startDate', startDate);

    this.spinner.show();
    forkJoin([
      this.apiService.get('users/timeslots', queryParams),
      this.apiService.get('users/unavailableslot', {
        consultantId: this.consultantId,
      }),
    ]).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('res', res);
        let { slots } = res[0].data;
        let unavailableSlots = res[1].data;

        unavailableSlots = unavailableSlots.filter(
          (slot) => startDate == getFormatedDate(slot.date),
        );

        if (unavailableSlots.length) {
          slots = slots.map((slot) => {
            slot.available = !unavailableSlots.find(
              (uaSlot) => uaSlot.slot == slot.startTime + ' - ' + slot.endTime,
            );
            return slot;
          });
        }
        slots = slots.filter((slot: any) => slot.available && !slot.isBooked);

        let bookingTimeGap = 30; // 30mint
        let date = new Date();

        if (startDate == getFormatedDate(date)) {
          slots = slots.filter((el: any) => {
            let startTimeArr = el.startTime.split(':').map((el) => parseInt(el));
            let [h, m] = startTimeArr;
            return h * 60 + m > date.getHours() * 60 + date.getMinutes() + bookingTimeGap;
          });
        }

        this.selectedTimeSlot.slots = slots;
        console.log('slot', slots);
        // this.setSelectedDateSlots();
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err?.error?.message || 'Something went wrong');
      },
    );
  }

  setSelectedDateSlots() {
    let { year, month, day } = this.apptScheduleForm.value.date;
    console.log('[selected date]', this.apptScheduleForm.value.date);

    console.log('slotData', this.slotsData);

    let timeSlot = this.slotsData.timeSlots.find((el) => {
      let selectedDate = `${year}-${month < 10 ? '0' + month : month}-${
        day < 10 ? '0' + day : day
      }`;
      return getFormatedDate(selectedDate) == getFormatedDate(el.date);
    });

    // let date:any = this.apptScheduleForm.value.date.year-this.apptScheduleForm.value.date.month-this.apptScheduleForm.value.date.day;
    // this.getAvailableSlots(date);

    console.log('timeSlot', timeSlot);

    if (timeSlot) {
      this.selectedTimeSlot = timeSlot;
    } else {
      this.selectedTimeSlot.slots = [];
    }
  }

  handleAttpScheduleError(err: HttpErrorResponse, timeSlot: string) {
    this.spinner.hide();
    if (err.error?.message?.toLowerCase() == 'slot not available') {
      this.toastr.error('Please choose other slot', 'Slot not available!');
      let index = this.selectedTimeSlot.slots.findIndex(
        (slot) => slot.startTime + ' - ' + slot.endTime == timeSlot,
      );
      this.selectedTimeSlot.slots.splice(index, 1);
    } else {
      this.toastr.error(err.error?.message || 'Something went wrong');
    }
  }

  onSubmitAttpSchedule() {
    let { date, primaryTimeSlot } = this.apptScheduleForm.value;
    if (this.activeModalData.type == 'reschedule') {
      let data = {
        _id: this.activeModalData.apptId,
        date: `${date.year}-${date.month < 10 ? '0' + date.month : date.month}-${date.day < 10 ? '0' + date.day : date.day}`,
        primaryTimeSlot,
      };
      this.spinner.show();
      this.apiService.post('appointments/reschedule', data).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.toastr.success('Appointment rescheduled successfully');
          this.openModalRef.close();
          this.getDetails();
        },
        (err: HttpErrorResponse) => {
          this.handleAttpScheduleError(err, primaryTimeSlot);
          this.getDetails();
        },
      );
    } else if (this.activeModalData.type == 'followUp') {
      let data = {
        consultantId: this.consultantId,
        parentAppointmentId: this.activeModalData.apptId,
        date: `${date.year}-${date.month < 10 ? '0' + date.month : date.month}-${date.day < 10 ? '0' + date.day : date.day}`,
        primaryTimeSlot,
        fee: this.apptData.consultantId.fee,
        paymentCallbackUrl: environment.userAppHost + 'payments',
      };
      this.spinner.show();
      this.apiService.post('appointments/followup', data).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.toastr.success('Follow-up created successfully');
          this.openModalRef.close();
          this.getDetails();
        },
        (err: HttpErrorResponse) => {
          this.handleAttpScheduleError(err, primaryTimeSlot);
        },
      );
    }
  }

  markCompleted(_id, isFollowUp = false) {
    let check = confirm('Are you sure you want to mark this appointment as completed?');
    if (check) {
      let data = {
        _id,
        status: 'Completed',
      };
      this.spinner.show();
      this.apiService.put('appointments', data).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.toastr.success('Status updated successfully');
          this.getDetails();
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error(err.error.message || 'Something went wrong!');
        },
      );
    }
  }

  markClosed(_id, isFollowUp = false) {
    if (!isFollowUp) {
      let appt = this.followUps.find(
        (el) => el.status == 'Confirmed' || el.status == 'Re-scheduled',
      );
      if (appt) {
        this.toastr.warning('Please mark completed the Follow Up first');
        this.activeTab = 2;
        return;
      }
    }
    let check = confirm(
      'Are you sure you want to mark this appointment as closed? You will not be able to create a follow-up for the same appointment.',
    );
    if (check) {
      let data = {
        _id,
        status: 'Closed',
      };
      this.spinner.show();
      this.apiService.put('appointments', data).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.toastr.success('Status updated successfully');
          this.getDetails();
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error(err.error.message || 'Something went wrong!');
        },
      );
    }
  }

  openVariationModal() {
    this.openModalRef = this.modalService.open(this.variationModal, {
      size: 'lg',
      windowClass: 'modal-holder',
      centered: true,
    });
  }

  openUpdateVariationModal(product, formGroup: FormGroup) {
    this.selectedMedicineFG = formGroup;
    this.qty = product.qty;
    this.selectedProduct = product.data;
    this.makeDefaultVariantsSelected(this.selectedProduct);
    this.openVariationModal();
  }

  checkIsSameGroup(values1: string[], values2: string[]): boolean {
    let set = new Set();
    values1.forEach((el) => set.add(el));
    values2.forEach((el) => set.add(el));
    return values1.length == set.size;
  }

  makeDefaultVariantsSelected(product) {
    if (!product.mainVariations.length || !product.variations.length) return;
    product.variations.forEach((variation) => (variation.isSelected = false));
    let currentGroup = product.variations.find((el) => product.slug == el.slug);

    if (currentGroup) {
      /** if product type is variant */
      currentGroup.isSelected = true;
      let labelArr = currentGroup.label;
      labelArr.forEach((label) => {
        product.mainVariations.forEach((el) => {
          let index = el.values.indexOf(label);
          if (index != -1) {
            el.selectedIndex = index;
          }
        });
      });
      product.selectedVariation = currentGroup;
    } else {
      /** if product type is normal */
      product.variations[0].isSelected = true;
      let selectedValue = [];

      let labelArr = product.variations[0].label;
      labelArr.forEach((label) => {
        product.mainVariations.forEach((el) => {
          let index = el.values.indexOf(label);
          if (index != -1) {
            el.selectedIndex = index;
            selectedValue.push(el.values[index]);
          }
        });
      });

      // product.mainVariations.forEach(el => {
      //   selectedValue.push(el.values[0])
      //   el.selectedIndex = 0;
      // });

      if (product.variationsStructureType == 'group') {
        var group = product.variations[0];
      } else {
        group = product.variations.find((el) => this.checkIsSameGroup(selectedValue, el.label));
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
      };
      this.selectedProduct = { ...product };
    }
  }

  addTitleInVariations(product) {
    if (!(product.variations && product.mainVariations)) return;
    product.variations.forEach((el) => {
      el.title = [];
      el.label.forEach((label) => {
        product.mainVariations.forEach((mVariation) => {
          if (typeof mVariation.variationId != 'object')
            console.error("Custom Error: Cannot read property 'title' of variationId");
          if (mVariation.values.includes(label)) {
            el.title.push(mVariation.variationId.title || 'Unknown');
          }
        });
      });
    });
  }

  changeQty(type) {
    if (type == 'plus') {
      this.qty += 1;
    } else {
      if (this.qty == 1) return;
      this.qty -= 1;
    }
  }

  selectVariation(product, variation, index?) {
    let selectedVariation;
    if (product.variationsStructureType == 'group') {
      product.variations.forEach((el) => {
        el.isSelected = false;
      });
      variation.isSelected = true;
      selectedVariation = variation;
    } else {
      variation.selectedIndex = index;
      let selectedValues = [];
      product.mainVariations.forEach((mVariation) => {
        selectedValues.push(mVariation.values[mVariation.selectedIndex]);
      });

      selectedVariation = product.variations.find((el) =>
        this.checkIsSameGroup(selectedValues, el.label),
      );
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
    };
    this.selectedProduct = product;
    console.log(this.selectedProduct);
  }

  // searchProducts now accepts an optional index so we can keep per-row custom entries
  searchProducts(event, idx?: number) {
    if (this.debouncer) {
      clearInterval(this.debouncer);
    }
    this.debouncer = setTimeout((x) => {
      let { value } = event.target;
      value = value && value.trim();
      const makeCustomId = (i) => `customvalue_${i}`;

      // collect existing custom items to preserve them across searches
      const existingCustom = (this.productList || []).filter(
        (p) => p && p._id && typeof p._id === 'string' && p._id.startsWith('customvalue_'),
      );

      if (value) {
        if (typeof idx === 'number' && idx >= 0) {
          const id = makeCustomId(idx);
          const customItem = { _id: id, name: value, brandId: { name: '--' } } as any;
          // ensure the current custom item is present/upserted in productList front
          const otherCustom = existingCustom.filter((c) => c._id !== id);

          // call search API and then merge results with custom items
          this.eService.algoliaSearch(value).subscribe(
            (res) => {
              if (res.success) {
                let hits = [...res.data1.hits];
                // remove any duplicate of current custom id from hits
                hits = hits.filter((h) => h._id !== id);
                this.productList = [customItem, ...hits, ...otherCustom];
              }
            },
            (err) => {
              // on error, still show the custom item plus other custom items
              this.productList = [customItem, ...otherCustom];
            },
          );
        } else {
          // fallback: legacy single customvalue entry
          const customItem = { _id: 'customvalue', name: value, brandId: { name: '--' } } as any;
          this.eService.algoliaSearch(value).subscribe(
            (res) => {
              if (res.success) {
                let hits = [...res.data1.hits];
                hits = hits.filter((h) => h._id !== 'customvalue');
                this.productList = [customItem, ...hits];
              }
            },
            (err) => {
              this.productList = [customItem];
            },
          );
        }
      } else {
        // no value: remove per-row custom item if present
        if (typeof idx === 'number' && idx >= 0) {
          const id = makeCustomId(idx);
          this.productList = (this.productList || []).filter((p) => p._id !== id);
        } else {
          // fallback remove the legacy first element if it was custom
          if (
            this.productList &&
            this.productList.length &&
            this.productList[0]._id === 'customvalue'
          ) {
            this.productList.shift();
          }
        }
      }
    }, 400);
  }

  onSelectProduct(event, formGroup: FormGroup) {
    if (!event) return;
    this.selectedMedicineFG = formGroup;
    console.log(event);
    if (event._id && (event._id + '').startsWith('customvalue')) {
      // set the display id in 'name' control so ng-select shows the value
      try {
        formGroup.get('name').setValue(event._id);
      } catch (e) {}
      this.setProductValue(formGroup, {
        data: { _id: event._id, name: event.name },
      });
      return;
    }

    this.qty = 1;
    let product = JSON.parse(JSON.stringify(event));
    this.selectedProduct = product;

    if (product.type == 'Normal' && product.variations.length) {
      product.variations.sort(
        (a, b) => (a.price.minPrice || a.price.mrp) - (b.price.minPrice || a.price.mrp),
      );
      let variation = product.variations[0];
      // product._id = variation.productId;
      // product.price = variation.price;
      // product.weight = variation.weight;
      // product.slug = variation.slug;
    }
    if (product.mainVariations.length && product.variations.length) {
      product.mainVariations = product.mainVariations.filter((el) => !!el.values.length);
      product.variations = product.variations.filter((el) => !!el.label.length);
      if (product.mainVariations.length && product.variations.length) {
        let maxGroupSize =
          product.mainVariations.map((el) => el.values.length).reduce((total, el) => total * el) ||
          0;

        this.addTitleInVariations(product);

        if (product.variations.length != maxGroupSize) {
          product.variationsStructureType = 'group';
        } else {
          product.variationsStructureType = 'single';
        }

        this.makeDefaultVariantsSelected(product);
        this.openVariationModal();
      }
    }
    // set the display id in 'name' control so ng-select shows the selected item
    try {
      formGroup.get('name').setValue(event._id);
    } catch (e) {}
    this.setProductValue(formGroup, { data: this.selectedProduct, qty: 1 });
  }

  createMedicineFG(
    name = '',
    dosage = '',
    days = '',
    meal = 'After Meal',
    time = this.timings.map((_) => !1),
    repeat = '',
    repeatAfterDays = 1,
  ) {
    return this.fb.group({
      name: [name, Validators.required],
      product: [null, Validators.required],
      dosage: [dosage, Validators.required],
      days: [days, Validators.required],
      meal: [meal],
      time: this.fb.array(time),
      repeat: [repeat],
      repeatAfterDays: [repeatAfterDays, [Validators.min(1)]],
    });
  }

  get medicineFA() {
    return <FormArray>this.form.get('medicines');
  }

  addMedicine() {
    this.medicineFA.push(this.createMedicineFG());
  }

  removeMedicine(i: number) {
    this.medicineFA.removeAt(i);
  }

  setProductValue(formGroup: FormGroup, data: { data: any; qty?: number } | null) {
    formGroup.get('product').setValue(data);
  }

  convertToValue(key: string, value: any[]) {
    return value.map((x, i) => x && this[key][i]).filter((x) => !!x);
  }

  startWritingPres() {
    let recentPres = this.prescriptionList[0];
    if (recentPres) {
      let { chiefComplaints, treatment, pastHistory, otherPastHistory } = recentPres;

      if (otherPastHistory) {
        pastHistory = [...pastHistory, { name: 'Other' }];
        this.showOtherHistory = true;
      }

      let data = {
        chiefComplaints: chiefComplaints || '',
        treatment: treatment || '',
        pastHistory: this.history.map((val) => pastHistory.find((val2) => val2.name == val)),
        otherPastHistory: otherPastHistory || '',
      };
      this.form.patchValue(data);
    } else {
      this.form.patchValue({
        treatment: this.apptData.userId?.diseases?.map((el) => el.name).join(', ') || '',
      });
    }
    this.writePrescription = true;
  }

  clearPrescription() {
    this.form.reset();
    while (this.medicineFA.length) {
      this.medicineFA.removeAt(0);
    }
    this.addMedicine();
  }

  submitPrescription(): void {
    this.submit.pres = true;
    if (this.form.invalid) {
      this.toaster.error('Please fill all mandatory fields');
      return;
    }

    let value = JSON.parse(JSON.stringify(this.form.value));
    let investigations = this.convertToValue('investigations', value.investigations).map((el) => {
      return { name: el, value: true };
    });
    let pastHistory = this.convertToValue('history', value.pastHistory);
    let otherHistory = pastHistory.indexOf('Other');
    if (otherHistory != -1) {
      pastHistory.splice(otherHistory, 1);
    }
    pastHistory = pastHistory.map((el) => {
      return { name: el, value: true };
    });

    value.vitals = value.vitals.map((val, i) => {
      val = (val || '').trim();
      return { ...this.vitals[i], value: val };
    });

    value.medicines = value.medicines.map((medicine) => {
      medicine.time = this.convertToValue('timings', medicine.time);
      let { product } = medicine;
      // product may contain per-row custom ids like 'customvalue_2', 'customvalue_3',
      // treat any id that starts with 'customvalue' as a custom entry (no medicineId)
      const pid = product && product.data && product.data._id;
      const isCustom = typeof pid === 'string' && pid.startsWith('customvalue');

      if (isCustom) {
        medicine.name = product.data.name;
      } else if (product && product.data && pid) {
        medicine.medicineId = pid;
        medicine.name = product.data.name;
        medicine.qty = product.qty;
      }
      medicine.days = medicine.days ? parseInt(medicine.days, 10) : '';
      medicine.repeat = medicine.repeat || 'Daily';
      medicine.meal = medicine.meal == 'None' ? '' : medicine.meal;
      delete medicine.product;
      return medicine;
    });
    console.log({ prescription2: value }, this.form);
    const data = {
      appointmentId: this.appointmentId,
      userId: this.apptData.userId,
      title: value.title,
      chiefComplaints: value.chiefComplaints,
      examination: value.examination,
      treatment: value.treatment,
      investigations,
      pastHistory,
      otherPastHistory: value.otherPastHistory,
      appetite: value.appetite,
      vitals: value.vitals,
      note: value.note,
      medicines: value.medicines,
    };
    console.log(data, JSON.stringify(data));

    this.spinner.show();
    this.apiService.post('prescriptions', data).subscribe(
      (res: any) => {
        console.log('res', res);
        this.writePrescription = false;
        this.clearPrescription();
        this.spinner.hide();
        this.pagination.prescription.page = 1;
        this.prescriptionList = [];
        this.getPrescriptions();
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err.error.message || 'Something went wrong!');
      },
    );
  }

  addMedicalRecord() {
    this.openModalRef = this.modalService.open(this.medicalRecordModal, {
      size: 'lg',
      windowClass: 'modal-holder',
      centered: true,
    });
  }

  onAttachment(event): void {
    let { target } = event;
    let file: File = target.files[0];

    if (file) {
      if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
        this.recordForm.patchValue({ attachment: '' });
        target.value = '';
        return;
      }
      this.recordForm.patchValue({ attachment: file as any });
    } else {
      this.recordForm.patchValue({ attachment: '' });
    }
  }

  onBlurAttachment() {
    this.recordForm.get('attachment').markAsTouched();
  }

  onSubmitMedicalRecord() {
    console.log(this.recordForm);
    this.spinner.show();
    let { value } = this.recordForm;
    this.apiService.fileUpload([this.recordForm.value.attachment as any], '').subscribe(
      (res: any) => {
        console.log('res', res);
        const data = {
          appointmentId: this.appointmentId,
          userId: this.apptData.userId,
          description: value.description,
          attachment: res.data[0],
          dateTime: value.date,
          by: 'Doctor',
        };
        console.log('data', data);
        this.apiService.post(`medicalrecords`, data).subscribe(
          (res: any) => {
            this.pagination.records.page = 1;
            this.medicalRecordList = [];
            this.getMedicalRecords();
            this.spinner.hide();
            this.modalService.dismissAll();
          },
          (err: HttpErrorResponse) => {
            console.log('error', err);
          },
        );
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err.error.message || 'Something went wrong');
        console.log('err', err);
      },
    );
  }

  viewPrescription(prescription) {
    console.log(this.viewPrescriptionElem);
    if (this.viewPrescriptionElem) {
      this.viewPrescriptionElem.viewPrescription(prescription._id);
    }
    return;
    this.spinner.show();
    this.consultationService.getPrescriptionDetails(prescription._id).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.data) {
          let { DOB } = res.data.userId;
          if (DOB) {
            try {
              let dob = new Date(DOB);
              let current = new Date();

              res.data.userId.DOBYear = current.getFullYear() - dob.getFullYear();
              res.data.userId.DOBMonth = current.getMonth() - dob.getMonth();
            } catch (e) {}
          }
          // this.prescriptionModalData = res.data;
          this.prescriptionModalData = {
            prescriptionHtml: this.sanitizer.bypassSecurityTrustHtml(res.prescriptionHtml),
          };
        }
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err.error?.message || 'Something went wrong!');
      },
    );

    this.openModalRef = this.modalService.open(this.prescriptionModal, {
      size: 'xl',
      windowClass: 'modal-holder',
      centered: true,
    });
  }

  onChangeView() {
    this.showDropdown = !this.showDropdown;
  }

  cancelAppointment(id = this.appointmentId) {
    this.showDropdown = false;

    const modalRef = this.modalService.open(DeleteModalComponent, {
      size: 'lg',
    });

    modalRef.componentInstance.data = 'cancelAppointment';

    modalRef.result.then(
      (result) => {
        if (result == 'yes') {
          this.spinner.show();
          this.consultationService.cancelAppointment({ _id: id }).subscribe(
            (res: any) => {
              this.spinner.hide();
              this.toaster.success(res.message);
              this.getDetails();
            },
            (err: HttpErrorResponse) => {
              let { error } = err;
              this.spinner.hide();
              this.toaster.error(error?.message || 'Something went wrong');
              this.getDetails();
            },
          );
        }
      },
      (reason) => {
        console.log('reason', reason);
      },
    );
  }

  downloadPrescription() {
    let { title, userId } = this.prescriptionModalData;
    let username = '';
    if (userId) {
      username = userId.firstName + ' ' + userId.lastName;
    }
    this.pdf.downloadPDF(
      '#presCont',
      `${title}-${username}-${getFormatedDate(new Date(), 'DD-MM-YYYY')}`,
    );
  }

  viewImage(data) {
    this.viewMedicalRecordElem.viewRecord(data);
    return;
    this.currentOpenedAttachment = data;

    let fileType: any;
    fileType = this.currentOpenedAttachment.split('.');
    this.currentOpenedAttachmentType = fileType[1];
    if (
      this.currentOpenedAttachmentType == 'pdf' ||
      this.currentOpenedAttachmentType == 'PDF' ||
      this.currentOpenedAttachmentType == 'Pdf'
    ) {
      this.showImageBlock = false;
      this.currentOpenedAttachment = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.imageUrl + this.currentOpenedAttachment + '#toolbar=0',
      );
    } else {
      this.showImageBlock = true;
    }
    this.openModalRef = this.modalService.open(this.medicalAttachmentModal, {
      size: 'xl',
      windowClass: 'modal-holder',
      centered: true,
    });
    window.scroll(0, 0);
  }

  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  showOtherHistory = false;
  changePastHistory(event) {
    let { value, checked } = event.target;
    if (value == 'Other') {
      this.showOtherHistory = checked;
    }
  }

  openCallDetailsModal(modalRef, appt) {
    this.openModalRef = this.modalService.open(modalRef, {
      size: 'lg',
      windowClass: 'modal-holder',
      centered: true,
    });
    this.callDetails = appt.event || {};
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.toaster.success('Copied!');
  }
}
