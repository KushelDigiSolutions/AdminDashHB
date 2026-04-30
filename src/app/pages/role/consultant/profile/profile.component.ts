import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { forkJoin, of } from "rxjs";
import { ApiService } from "src/app/core/services/api.service";
import { FileUploadService } from "src/app/core/services/file-upload.service";
import { DoctorsService } from "src/app/pages/doctors/doctors.service";
import { EcommerceService } from "src/app/pages/ecommerce/ecommerce.service";
import { trimInputValue } from "src/app/util/input.util";
import { environment } from "src/environments/environment";
import { ConsultantApiService } from "../consultant-api.service";

@Component({
  standalone: false,
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  breadCrumbItems = [
    { label: "Home" },
    { label: "Profile Settings", active: true },
  ];
  s3Base = environment.imageUrl;

  profileData: any;
  specializationList = [];
  healthConcern = [];
  doctorTypes: Array<{}>;
  photo: { file?: File; base64?: string | ArrayBuffer } = {} as any;
  oldFiles = [];
  files = [];
  accountType = ["savings", "current"];
  form: any = this.fb.group({
    firstName: ["", Validators.required],
    lastName: "",
    phone: "",
    email: "",
    experience: ["", Validators.pattern(/^[0-9]{0,2}$/)],
    experienceInMonths: ["", Validators.pattern(/\b([0-9]|10|11)\b/)],
    fee: ["", Validators.required],
    designation: "",
    DOB: ["", Validators.required],
    consultantType: [[]],
    speciality: [[]],
    specialization: [[]],
    description: "",
    gender: "",
    language: "",
    qualification: this.fb.array([]),
    currentAddress: this.fb.group({
      city: "",
      state: "",
      pinCode: "",
    }),
    signature: [[]],
    accountInfo: this.fb.group({
      account_name: "",
      account_type: "",
      account_number: "",
      bank_name: "",
      bank_branch: "",
      bank_ifsc: "",
    }),
    appointmentMode: this.fb.group({
      isVideo: [false],
      isAudio: [false],
      isChat: [false]
    }),
  });

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private eCommerceService: EcommerceService,
    private api: ConsultantApiService,
    private uploadService: FileUploadService,
    private doctorService: DoctorsService
  ) { }

  ngOnInit(): void {
    this.getDoctorTypes();
    this.getSpecializationList();
    this.getHealthConcernsList();
    this.fetchProfile();
  }

  fetchProfile() {
    this.spinner.show();
    this.api.getProfile().subscribe(
      (res: any) => {
        this.spinner.hide();
        this.profileData = res.data;

        this.profileData.hbCommission =
          (this.profileData.hbCommission / 100) * this.profileData.totalEarning;

        this.populateForm();
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
      }
    );
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

  get qualificationFormArray() {
    return <FormArray>this.form.controls.qualification;
  }

  createEduFormGroup(
    degree = "",
    college = "",
    passingYear = "",
    show = true,
    certificate = [],
  ) {
    return this.fb.group({
      degree: [degree, [Validators.required]],
      college: [college, [Validators.required]],
      passingYear: [passingYear, [Validators.required]],
      show: [show],
      certificate: [certificate],
    });
  }

  addMoreEdu() {
    this.qualificationFormArray.push(this.createEduFormGroup());
  }

  removeEdu(i) {
    console.log(i);
    this.qualificationFormArray.removeAt(i);
  }

  getSpecializationList() {
    this.doctorService.getSpecializationListAll().subscribe((res: any) => {
      this.specializationList = res.data.healthSpeciality;
    }, (err: HttpErrorResponse) => {

    })
  }

  populateForm() {
    let { profilePhoto, firstName, lastName, phone, email, experience, experienceInMonths, fee, designation, DOB, consultantType, description, gender, language, qualification, accountInfo, currentAddress, speciality, specialization, signature, appointmentMode } = this.profileData;

    this.form.patchValue({
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      email: email || "",
      experience: experience || "",
      experienceInMonths: experienceInMonths || 0,
      fee: fee || fee === 0 ? parseInt(fee) : "",
      designation: designation || "",
      DOB: DOB || "",
      consultantType: consultantType.map((el) => el._id),
      description: description || "",
      gender: gender || "",
      language: language || "",
      speciality: speciality.map((el) => el),
      specialization: specialization.map((el) => el),
      currentAddress: {
        city: currentAddress?.city || "",
        state: currentAddress?.state || "",
        pinCode: currentAddress?.pinCode || "",
      },
      signature: signature ? [signature] : [],
      appointmentMode,
    });

    if (accountInfo[0]) {
      this.form.patchValue({
        accountInfo: {
          account_name: accountInfo[0].account_name,
          account_type: accountInfo[0].account_type,
          account_number: accountInfo[0].account_number,
          bank_name: accountInfo[0].bank_name,
          bank_branch: accountInfo[0].bank_branch,
          bank_ifsc: accountInfo[0].bank_ifsc,
        },
      });
    }

    this.qualificationFormArray.clear();
    qualification.forEach((el) => {
      let { degree, college, passingYear, show, certificate } = el;
      this.qualificationFormArray.push(
        this.createEduFormGroup(
          degree,
          college,
          passingYear,
          show,
          certificate ? [certificate] : []
        )
      );
    });
  }

  onImageChange(event) {
    console.log(event.target.files, typeof event.target.files[0]);
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.photo = {
          file,
          base64: e.target.result,
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.photo = {} as any;
    }
  }

  // onSelectCertificate(event, input: AbstractControl) {
  //   console.log(event, input);
  //   let file = event.addedFiles[0];
  //   if (file) input.setValue(file || "");
  // }

  // onRemoveCertificate(input: AbstractControl) {
  //   input.setValue("");
  // }

  // typeOf(value: any) {
  //   return typeof value;
  // }

  onSubmit() {
    let { value } = this.form;
    console.log(value, this.form);
    // return;

    this.spinner.show();
    const fileUploadReqArray = [];
    if (this.photo.file) {
      fileUploadReqArray.push(this.api.uploadFile(this.photo.file, "profile"));
    } else {
      fileUploadReqArray.push(of(null));
    }

    let [signature] = value.signature;
    if (this.uploadService.instanceOfFile(signature)) {
      fileUploadReqArray.push(this.api.uploadFile(signature));
    } else {
      fileUploadReqArray.push(of(signature ? { data: [signature._id] } : null));
    }

    value.qualification.forEach(el => {
      let [certificate] = el.certificate;
      if (this.uploadService.instanceOfFile(certificate)) {
        fileUploadReqArray.push(this.api.uploadFile(certificate));
      } else {
        fileUploadReqArray.push(of(certificate ? { data: [certificate._id] } : null));
      }
    });
    forkJoin(fileUploadReqArray).subscribe((res: Array<{ success: boolean, data: string[] }> | null) => {
      value = JSON.parse(JSON.stringify(value));
      let [profilePhotoRes, signatureRes, ...certificatesRes] = res;
      if (profilePhotoRes) value.profilePhoto = profilePhotoRes.data[0];
      signatureRes ? value.signature = signatureRes.data[0] : delete value.signature;

      certificatesRes.forEach((data, i) => {
        if (data) {
          value.qualification[i].certificate = data.data[0];
        } else {
          delete value.qualification[i].certificate;
        }
      });
      let { phone, email } = this.profileData;
      value.email = email;
      value.phone = phone;

      this.api.updateProfile(value).subscribe(
        (res) => {
          this.photo = {};
          this.fetchProfile();
          this.toastr.success("Profile updated successfully");
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error("Try again later.", "Something went wrong!");
        }
      );
    },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
      }
    );
  }

  isInvalidAppointmentMode() {
    let { value } = this.form.get('appointmentMode')
    return !(value.isAudio || value.isVideo || value.isChat);
  }

  onBlur(input) {
    trimInputValue(input);
  }
}
