import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CorporateService } from '../corporate.service';
import { CkUploadAdapter } from 'src/app/util/ckeditor.util';
import { thyrocareProductsData } from './ThyrocareProductsResponse';
import { DiagnosticsService } from '../../diagnostics/diagnostics.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getFormatedDate } from 'src/app/util/date.util';
import { trimInputValue } from 'src/app/util/input.util';

@Component({
  standalone: false,
  selector: 'app-camp-collection',
  templateUrl: './camp-collection.component.html',
  styleUrls: ['./camp-collection.component.scss']
})
export class CampCollectionComponent implements OnInit {
  @ViewChild("editor") editor: any;

  private search$ = new Subject();

  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Camp Collection", active: true },
  ];

  public Editor = ClassicEditor;
  config = {
    link: { addTargetToExternalLinks: true }
  };
  minDate = getFormatedDate(new Date());

  form = this.fb.group({
    title: ["", Validators.required],
    venue: ["", Validators.required],
    date: ["", Validators.required],
    time: ["", Validators.required],
    description: "",
    corporatePackageId: "",
  });

  packageId: string;
  editId: string;
  submitted = false;

  testList = [];

  constructor(
    private fb: FormBuilder,
    private diagsService: DiagnosticsService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
  ) { }

  ngOnInit(): void {
    this.packageId = this.route.snapshot.queryParams.package;
    this.editId = this.route.snapshot.params.id;

    this.search$.pipe(debounceTime(500)).subscribe(this.searchProducts.bind(this))

    this.form.patchValue({
      corporatePackageId: this.packageId
    })
    if (this.editId) {
      this.getCampDetails();
    }
  }

  getCampDetails() {
    this.diagsService.getCampCollection(this.editId).subscribe(res => {
      let { success, data } = res
      if (success && data) {
        let { corporatePackageId, dateTime, testsId, createdAt, updatedAt, ...rest } = data;

        this.form.patchValue({
          corporatePackageId: corporatePackageId._id,
          date: getFormatedDate(dateTime),
          time: getFormatedDate(dateTime, "H:mm"),
          ...rest
        })
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.spinner.show();
      const value: any = { ...this.form.value };
      const { date, time } = value;
      
      const d = new Date(date);
      if (time) {
        let [h, m] = time.split(':');
        d.setHours(Number(h), Number(m), 0, 0);
      }
      
      value.dateTime = d.toUTCString();
      delete value.date;
      delete value.time;

      let req = this.diagsService.createCampCollection(value);
      if (this.editId) {
        req = this.diagsService.updateCampCollection(this.editId, value);
      }
      req.subscribe(res => {
        this.spinner.hide();
        let { success } = res;
        if (success) {
          this.toastr.success(`Camp Collection ${this.editId ? 'Updated' : 'Created'} Successfully`)
          this.router.navigate(['/admin/corporate/packages', this.packageId], { queryParams: { view: 'camp' } })
        }
      }, (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Something went wrong!');
      })
    }
  }

  onReadyEditor(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new CkUploadAdapter(loader, 'upload');
    };
  }

  onSearchProducts(event: any) {
    this.search$.next(event.target.value)

  }
  searchProducts(val: any) {
    this.diagsService.searchProducts(val).subscribe(res => {
      let { success, data } = res;
      if (success) {
        this.testList = data;
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  trimValue(input: any){
    trimInputValue(input)
  }
}