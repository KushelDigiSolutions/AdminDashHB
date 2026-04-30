import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CmsService } from 'src/app/pages/cms/cms.service';
import { DoctorsService } from '../../doctors.service';
import { currentDate, getFormatedDate, time24to12 } from "src/app/util/date.util";

@Component({
  standalone: false,
  selector: 'app-add-payout',
  templateUrl: './add-payout.component.html',
  styleUrls: ['./add-payout.component.scss']
})
export class AddPayoutComponent implements OnInit {
  editId: string;
  form: FormGroup;

  pageSize = 10;
  page = 1;
  consultantArray = [];
  maxDate = currentDate()

  statusArray = [
    {
      name: "Success",
    },
    {
      name: "Unpaid"
    }
  ];
  types;
  constructor(
    private formBuilder: FormBuilder,
    private cmsService: CmsService,
    private doctorService: DoctorsService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      userId: ["", [Validators.required]],
      txnAmount: [null, [Validators.required, Validators.min(0)]],
      hbCommission: [null, [Validators.required, Validators.min(0)]],
      startDate: "",
      endDate: "",
      txnDate: "",
      resultStatus: "",
      txnId: "",
      paymentMode: "",
      paymentId: this.formBuilder.array([])
      // thirdParty: ["",[Validators.required]],
      // hbCommission: ["",[Validators.required]],
      // title: ["",[Validators.required]],
      // thirdPartyCommission: ["",[Validators.required]]
    });

    this.route.params.subscribe(res => {
      this.editId = res.id;
    });

  }

  ngOnInit(): void {

    if (this.editId) {
      this.getPayoutDetail();
    }

    this.getConsultantList();

  }

  get f() {
    return this.form.controls
  }

  getPayoutDetail() {
    this.doctorService.getPayoutDetail(this.editId).subscribe((res: any) => {

      let { data } = res;
      this.form.patchValue({
        userId: data.userId._id,
        txnDate: getFormatedDate(data.txnDate),
        resultStatus: data.resultStatus,
        txnId: data.txnId,
        paymentMode: data.paymentMode,
        // paymentId: data.paymentId
      })
    })
  }

  getConsultantList() {
    const url = `limit=${this.pageSize}&page=${this.page}`;
    this.doctorService.getDoctorList(url).subscribe((res: any) => {
      this.consultantArray = res.data
    }, (err: HttpErrorResponse) => {

    })
  }

  addPayout() {
    let value = this.form.value;
    if (this.editId) {
      value._id = this.editId;
    }
    (this.editId ? this.doctorService.updatePayout(value) : this.doctorService.addPayout(value))
      .subscribe((res: any) => {
        this.toaster.success(res.message);
        this.router.navigate(["/doctors/payouts"]);
      }, (err => {
        this.toaster.error("Something went wrong");
      }))
  }
}