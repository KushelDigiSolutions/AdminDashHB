import { firstValueFrom } from 'rxjs';
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
  selector: 'app-add-attribute-to-set',
  templateUrl: './add-attribute-to-set.component.html',
  styleUrls: ['./add-attribute-to-set.component.scss']
})
export class AddAttributeToSetComponent implements OnInit {

  attributeName:any;

  attributeData;

  @Input() 
  set data(data:any){
    this.attributeData =  data;
  }
  get data():any{
    return this.attributeData
  };

  constructor(
    private apiService: EcommerceService,
    private toaster: ToastrService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(){
    this.attributeName = this.data.name;
  }

  addAttribute(){
    const data = {
      name: this.attributeName,
      _id: this.data ? this.data._id : '',
      attributeSetId: this.data.attributeSetId._id,
      categoryIds: this.data.categoryIds,
      isFilterable: this.data.isFilterable,
      slug: this.data.slug,
      value: this.data.value
    }
    firstValueFrom(this.apiService.updateAttribute(data))
    .then((res:any)=>{
      this.activeModal.close(res.success);
      this.toaster.success(res?.message);
    })
    .catch((err:any)=>{
      this.toaster.error(err.error);
    });
  }

}