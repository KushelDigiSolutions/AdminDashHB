import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { forkJoin, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { ContactsService } from "../../contacts/contacts.service";
import { EcommerceService } from "../../ecommerce/ecommerce.service";
import { DoctorsService } from "../doctors.service";
import { Doctor } from "./doctors";
import { ConsultantApiService } from "../../role/consultant/consultant-api.service";
import { trimInputValue } from "src/app/util/input.util";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewImageComponent } from "../modals/view-image/view-image.component";
import { SpecialityComponent } from "../../cms/speciality/speciality.component";
import { AddSpecialityComponent } from "../../cms/speciality/add-speciality/add-speciality.component";
import { isValidTime, mintToTimeFormat, time24to12, timeToMintFormat } from 'src/app/util/date.util';
import { AuthenticationService } from "src/app/core/services/auth.service";
import { getUserRoles } from "src/app/util/user-role.util";
import { FileUploadService } from "src/app/core/services/file-upload.service";

@Component({
  standalone: false,
  selector: "app-add-doctors",
  templateUrl: "./add-doctors.component.html",
  styleUrls: ["./add-doctors.component.scss"],
})
export class AddDoctorsComponent implements OnInit {
  isSubmitted = false;
  editId: string;
  breadCrumbItems: Array<{}>;
  form: FormGroup;
  doctor: Doctor;
  doctorTypes: Array<any> = [];
  files: Array<File> = [];
  oldFiles = [];
  s3Base = environment.imageUrl;
  doctorProfileDetail: any;

  showRole: boolean = true;
  roles = [];

  healthConcern: Array<{}> = [];
  accountType = ["savings", "current"];

  show = false;
  slotsDataObj = {};
  activeDay = 'Sunday';
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  specializationList = [];
  currentChecked: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private eCommerceService: EcommerceService,
    private contactService: ContactsService,
    private doctorService: DoctorsService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private api: ConsultantApiService,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private uploadService: FileUploadService,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: "",
      email: ["", [Validators.email, Validators.required]],
      phone: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      consultantType: [[]],
      DOB: "",
      experience: ["", Validators.pattern(/^[0-9]{0,2}$/)],
      experienceInMonths: ["", Validators.pattern(/\b([0-9]|10|11)\b/)],
      fee: ["", [Validators.required, Validators.pattern(/^[0-9]{0,5}$/)]],
      language: "",
      designation: "",
      description: "",
      speciality: [[]],
      role: [["Consultant"]],
      inHouse: false,
      appointmentMode: this.formBuilder.group({
        isVideo: [false],
        isAudio: [false],
        isChat: [false]
      }),
      activate: [false],
      address: this.formBuilder.group({
        country: "",
        city: "",
        line1: "",
        name: "",
        phoneNo: ["", Validators.pattern(/^[0-9]{10}$/)],
        pinCode: "",
        state: "",
        type: "work",
      }),
      currentAddress: this.formBuilder.group({
        city: "",
        pinCode: "",
        state: ""
      }),
      profilePhoto: ["", [Validators.required]],
      qualification: this.formBuilder.array([]),
      accountInfo: this.formBuilder.group({
        account_name: "",
        account_type: "",
        account_number: "",
        bank_name: "",
        bank_branch: "",
        bank_ifsc: "",
      }),
      specialization: [[]],
      slotDuration: ['00:30', Validators.required],
      timeSlots: this.formBuilder.array([]),
      consultant: this.formBuilder.group({
        hbCommission: [null, [Validators.min(0), Validators.max(100)]],
        metaTitle: [''],
        metaDescription: [''],
      })
    });
    this.route.params.subscribe((res: any) => {
      this.editId = res.id;
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Doctors" },
      { label: `${this.editId ? "Update" : "Add"} Doctor`, active: true },
    ];
    this.roles = getUserRoles()
    this.getDoctorTypes();

    this.getHealthConcernsList();

    this.getSpecializationList();

    this.editId ? this.getDoctorDetail() : '';
  }

  getDoctorTypes() {
    this.eCommerceService.getTypes().subscribe(
      (res: any) => {
        this.doctorTypes = res.data;
      },
      (err: HttpErrorResponse) => {
        console.log("err", err);
      }
    );
  }

  getHealthConcernsList() {
    this.eCommerceService.getHealthConcernListingAll().subscribe((res: any) => {
      this.healthConcern = res.data;
    });
  }

  getSpecializationList() {
    this.doctorService.getSpecializationListAll().subscribe((res: any) => {
      this.specializationList = res.data.healthSpeciality;
    }, (err: HttpErrorResponse) => {

    })
  }

  getDoctorDetail() {
    this.doctorService.getDoctorDetail(this.editId).subscribe(
      (res: any) => {
        let { data } = res;
        this.doctorProfileDetail = res.data;
        this.oldFiles =
          typeof data.profilePhoto == "object" ? [data.profilePhoto] : [];

        this.doctorProfileDetail.timeSlots.forEach(slot => {
          this.slotsDataObj[slot.day] = slot;
        });

        this.form.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          consultantType: data.consultantType.map((el) => el._id),
          DOB: data.DOB,
          experience: data.experience,
          experienceInMonths: data.experienceInMonths || 0,
          fee: data.fee,
          language: data.language,
          designation: data.designation,
          description: data.description,
          speciality: data.speciality.map((el) => el),
          specialization: data.specialization.map((el) => el),
          role: data.role.map((el) => el),
          inHouse: data.inHouse ? 'true' : 'false',
          appointmentMode: data.appointmentMode,
          activate: data.activate,
          profilePhoto: this.oldFiles[0].savedName,
          address: {
            city: data?.address[0]?.city || '',
            line1: data?.address[0]?.line1 || '',
            name: data?.address[0]?.name || '',
            phoneNo: data?.address[0]?.phoneNo || '',
            pinCode: data?.address[0]?.pinCode || '',
            state: data?.address[0]?.state || '',
          },
          currentAddress: {
            city: data?.currentAddress?.city || '',
            state: data?.currentAddress?.state || '',
            pinCode: data?.currentAddress?.pinCode || ''
          },
          accountInfo: {
            account_name: data?.accountInfo[0]?.account_name || '',
            account_type: data?.accountInfo[0]?.account_type || '',
            account_number: data?.accountInfo[0]?.account_number || '',
            bank_name: data?.accountInfo[0]?.bank_name || '',
            bank_branch: data?.accountInfo[0]?.bank_branch || '',
            bank_ifsc: data?.accountInfo[0]?.bank_ifsc || '',
          },
          slotDuration: mintToTimeFormat(this.doctorProfileDetail.slotDuration) || '00:30',
          consultant: data.consultant || {},
        });
        this.qualificationFormArray.clear();
        data.qualification.forEach((el) => {
          let { degree, college, passingYear, certificate } = el;
          this.qualificationFormArray.push(
            this.createEduFormGroup(
              degree,
              college,
              passingYear,
              certificate ? [certificate] : []
            )
          );
        });

        this.days.forEach(day => {
          let slot = this.doctorProfileDetail.timeSlots.find(el => day == el.day);
          if (slot) {
            this.timeSlotsFA.push(this.createTimeSlot(day, slot.availableTime.map(el => ({ startTime: el.startTime, endTime: el.endTime }))));
          } else {
            this.timeSlotsFA.push(this.createTimeSlot(day, []));
          }
        });
      },
      (err: HttpErrorResponse) => {
        this.toaster.error(err.error?.message || 'Something went wrong!');
        if (err.status == 404) {
          this.router.navigate(['/doctors'], { replaceUrl: true });
        }
      }
    );
  }

  get timeSlotsFA() {
    return <FormArray>this.form.get('timeSlots')
  }

  get availableTimeFA() {
    return <FormArray>this.form.get('timeSlot').get('availableTime')
  }

  createTimeSlot(day = '', availableTime = []) {
    return this.formBuilder.group({
      day: [day],
      availableTime: this.formBuilder.array(availableTime.map(el => this.createAvailableTimeFG(el.startTime, el.endTime)))
    })
  }

  createAvailableTimeFG(startTime = '', endTime = '') {
    return this.formBuilder.group({
      startTime: [startTime, [Validators.required, this.timeIntersectionValidator('startTime')]],
      endTime: [endTime, [Validators.required, this.endTimeValidator(), this.timeIntersectionValidator('endTime')]],
    });
  }

  timeIntersectionValidator(type: 'startTime' | 'endTime'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let time = control.value, matchTime = false;
      if (!time || !isValidTime(time) || !control.parent) return null;
      const parentFG = control.parent;
      const availableTimeFA = parentFG.parent as FormArray;
      const length = availableTimeFA.controls.length;
      for (let i = 0; i < length; i++) {
        const formGroup = availableTimeFA.controls[i];
        if (parentFG == formGroup) continue;
        let { startTime, endTime } = formGroup.value;
        if (isValidTime(startTime) && isValidTime(endTime)) {
          matchTime = time == startTime || time == endTime || (time > startTime && time < endTime);
          if (!matchTime) {
            let pair = [];
            let secondPair = parentFG.value[type == 'startTime' ? 'endTime' : 'startTime'];
            if (type == 'startTime') {
              pair = [time, secondPair];
            } else {
              pair = [secondPair, time];
            }
            matchTime = isValidTime(secondPair) && pair[0] < startTime && pair[1] > endTime;
          }
          if (matchTime) break;
        }
      }
      return matchTime ? { timeIntersect: true } : null;
    };
  }

  endTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      let startTime = control.parent.get('startTime').value;
      let endTime = control.value;
      if (!endTime || !startTime || !isValidTime(startTime) || !isValidTime(endTime)) return null;
      let [stHour, stMint] = startTime.split(':');
      let [etHour, etMint] = endTime.split(':');
      let stHourN = parseInt(stHour);
      let stMintN = parseInt(stMint);
      let etHourN = parseInt(etHour);
      let etMintN = parseInt(etMint);
      return stHourN < etHourN || stHourN == etHourN && stMintN < etMintN ? null : { endTime: true };
    };
  }

  onChangeDay(day: string) {
    if (this.activeDay == day) return;
    this.activeDay = day;
  }

  onChangeStartTime(control: FormGroup) {
    control.get('endTime').updateValueAndValidity();
  }


  addTimeSlot(formGroup: FormGroup) {
    (<FormArray>formGroup.get('availableTime')).push(this.createAvailableTimeFG())
  }

  removeTimeSlot(formGroup: FormGroup, i: number) {
    (<FormArray>formGroup.get('availableTime')).removeAt(i);
  }



  checkUser() {
    return true;
  }

  onRemove(i: number) {
    this.files.splice(i, 1);
    this.form.patchValue({ image: this.files });
    this.updateImageControl(this.files);
  }

  onRemoveOldFile(i: number) {
    this.oldFiles.splice(i, 1);
    this.updateImageControl(this.oldFiles);
  }

  onSelect(event) {
    this.form.get("profilePhoto").markAsTouched();
    let file = event.addedFiles[0];
    if (file) {
      this.oldFiles = [];
      this.files = [file];
      this.form.patchValue({ profilePhoto: this.files });
      this.updateImageControl(this.files);
    }
  }

  updateImageControl(files) {
    this.form.patchValue({ profilePhoto: files });
    this.form.get("profilePhoto").markAsTouched();
  }

  get qualificationFormArray() {
    return <FormArray>this.form.controls.qualification;
  }

  addMoreEdu() {
    this.qualificationFormArray.push(this.createEduFormGroup());
  }

  createEduFormGroup(
    degree = "",
    college = "",
    passingYear = "",
    certificate = []
  ) {
    return this.formBuilder.group({
      degree: [degree, [Validators.required]],
      college: [college, [Validators.required]],
      passingYear: [passingYear, [Validators.required]],
      certificate: [certificate],
    });
  }

  removeEdu(i) {
    this.qualificationFormArray.removeAt(i);
  }

  viewDegree(value) {
    let modal = this.modalService.open(ViewImageComponent, { size: "lg" });

    modal.componentInstance.data = value;
  }

  addDoctor(goBack?: boolean) {
    this.isSubmitted = true;

    // if(this.currentChecked){
    //   let {currentAddress} = this.form.value;
    //   currentAddress.pinCode = this.form.get("address").get("pinCode").value;
    //   currentAddress.state = this.form.get("address").get("state").value;
    //   currentAddress.city = this.form.get("address").get("city").value;
    // }
    if (this.form.valid && !this.isInvalidAppointmentMode()) {
      let value = { ...this.form.value };

      value.slotDuration = timeToMintFormat(value.slotDuration);
      value.inHouse = value.inHouse === 'true';
      let { profilePhoto } = value;

      let uploadReq: Observable<any>;
      if (typeof profilePhoto[0] == "string") {
        uploadReq = of({ success: true, data: [this.oldFiles[0]._id] });
      } else {
        uploadReq = this.eCommerceService.fileUpload(profilePhoto, "profile");
      }
      this.spinner.show();
      uploadReq.subscribe(
        (res) => {
          value.profilePhoto = res.data[0];
          if (this.editId) {
            value._id = this.editId;
          }
          const fileUploadReqArray = [];

          if (value.qualification.length) {
            value.qualification.forEach((el) => {
              let [certificate] = el.certificate
              if (this.uploadService.instanceOfFile(certificate)) {
                fileUploadReqArray.push(this.api.uploadFile(certificate));
              } else {
                fileUploadReqArray.push(of(certificate ? { data: [certificate._id] } : null));
              }
            });
          } else {
            fileUploadReqArray.push(of(null));
          }
          forkJoin(fileUploadReqArray).subscribe(
            (res: Array<{ success: boolean; data: string[] }> | null) => {
              value = JSON.parse(JSON.stringify(value));
              let [...certificatesRes] = res;

              certificatesRes.forEach((data, i) => {
                if (data) {
                  value.qualification[i].certificate = data.data[0];
                } else if(value.qualification[i]) {
                  delete value.qualification[i].certificate;
                }
              });
              (this.editId
                ? this.doctorService.updateDoctor(value)
                : this.doctorService.addDoctor(value)
              ).subscribe(
                (res: any) => {
                  this.spinner.hide();
                  this.editId ? this.toaster.success('Details updated successfully') : this.toaster.success('Doctor created successfully');
                  goBack && this.router.navigate(["/doctors"]);
                },
                (err: HttpErrorResponse) => {
                  this.spinner.hide();
                  this.toaster.error(err.message || "Something went wrong");
                  console.log("err", err);
                }
              );
            },
            (err: HttpErrorResponse) => {
              this.spinner.hide();
            }
          );
        },
        (err: any) => {
          this.spinner.hide();
          this.toaster.error("Please try again");
        }
      );
    } else {
      console.log("form", this.form)
      this.toaster.info('Please fill all required fields')
    }
  }
  onBlur(input) {
    trimInputValue(input);
  }
  addType() {

    const data = {
      path: 'add-doctor'
    }

    let modal = this.modalService.open(AddSpecialityComponent, { size: "lg" });

    modal.componentInstance.data = data;

    modal.result.then((result) => {

      if (result.data) {
        let type = {
          name: result.data.name,
          _id: result.data._id
        }
        this.doctorTypes.push(type);
      }
    }).catch((err: any) => {
      console.log("err", err);
    })

  }

  getUserAddressArea() {
    let { pinCode } = this.form.get("address").value;
    this.spinner.show();
    this.eCommerceService.getUserAddressArea(pinCode).subscribe((res: any) => {
      this.spinner.hide();
      let area = res.data[0];
      if (area) {
        this.form.get("address").patchValue({
          country: 'India',
          state: area.stateName,
          city: area.districtName
        });
      } else {
        this.toaster.error('Invalid pincode')
      }
    }, err => {
      this.spinner.hide();
      this.toaster.error('Something went wrong');
    })
  }


  getUserCurrentAddressArea() {
    let { pinCode } = this.form.get("currentAddress").value;
    if (!pinCode) return;
    this.spinner.show();
    this.eCommerceService.getUserAddressArea(pinCode).subscribe((res: any) => {
      this.spinner.hide();
      let area = res.data[0];
      if (area) {
        this.form.get("currentAddress").patchValue({
          country: 'India',
          state: area.stateName,
          city: area.districtName
        });
      } else {
        this.toaster.error('Invalid pincode')
      }
    }, err => {
      this.spinner.hide();
      this.toaster.error('Something went wrong');
    })
  }
  checkboxClicked() {
    this.currentChecked = !this.currentChecked;
  }
  isInvalidAppointmentMode() {
    let { value } = this.form.get('appointmentMode')
    return !(value.isAudio || value.isVideo || value.isChat);
  }
}
