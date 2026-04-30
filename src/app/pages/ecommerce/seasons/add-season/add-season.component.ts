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
import { IBreadcrumbItems } from '../../../../shared/ui/pagetitle/pagetitle.component';
declare var bsCustomFileInput: any;
declare var bsCustomFileInput: any;
declare var bsCustomFileInput: any;
declare var bsCustomFileInput: any;
declare var bsCustomFileInput: any;
declare var bsCustomFileInput: any;
declare var bsCustomFileInput: any;
declare var bsCustomFileInput: any;
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
  selector: 'app-add-season',
  templateUrl: './add-season.component.html',
  styleUrls: ['./add-season.component.scss']
})
export class AddSeasonComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: IBreadcrumbItems;
  editId;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
    private spinner: NgxSpinnerService,
    private api: EcommerceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Seasons', path: '/ecommerce/seasons' }, { label: 'Create', active: true }];
    bsCustomFileInput.init();

    this.editId
    ? this.fetchSeasonDetail()
    : ''    

  }

  fetchSeasonDetail(){
    
  }

  onSubmit(form: NgForm) {
    console.log(form);

    this.spinner.show();
    this.api.createSeason(form.value).subscribe(res => {
      this.spinner.hide();
      this.toastr.success('Season created successfully!');
      this.router.navigateByUrl('/ecommerce/seasons')
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong!')
    });
  }

  trim(ngModel: NgModel) {
    ngModel.control.setValue(ngModel.value.trim());
  }
}
