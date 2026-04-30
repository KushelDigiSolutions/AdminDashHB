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
import { productList } from '../../product.model';
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
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent implements OnInit {

  productList  = [];
  recommended = [];
  similar = [];
  relatedFormGroup: FormGroup;

  @Input() upsell;
  @Input() crossSell;
  @Output() newItemEvent = new EventEmitter<any>();
  constructor(
    private formBuilder : FormBuilder,
    private apiService: EcommerceService
  ) {
    this.relatedFormGroup = this.formBuilder.group({
      similar: [[],this.formBuilder.array([])],
      recommended: [[],this.formBuilder.array([])]
    })
   }

  ngOnInit() {
    this.getProductList();
  }

  getProductList(){
    console.log("Related component - upsell ",this.upsell);
    console.log("Related component - crossSell",this.crossSell);
    let url = 'products/list';
    if(this.upsell.length){
      for(let product of this.upsell){
        this.similar.push(product._id);
        this.relatedFormGroup.patchValue({similar: this.similar});
      }
    }
    if(this.crossSell.length){
      for(let product of this.crossSell){
        this.recommended.push(product._id);
        this.relatedFormGroup.patchValue({recommended: this.recommended});
      }
    }
    
    firstValueFrom(this.apiService.getProductListAll(url))
    .then(async(res:any)=>{
      if(res.data){
        this.productList = res.data;
             
      }
    })
    .catch((err:any)=>{
      console.log(err);
    })

  }

  productSelected(){
    let data = {
      recommended: this.relatedFormGroup.get('recommended').value,
      similar: this.relatedFormGroup.get('similar').value
    };
    this.newItemEvent.emit(data);
  }

}
