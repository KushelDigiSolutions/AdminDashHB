import { firstValueFrom } from 'rxjs';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';
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
import { UIModule } from '../../../../../shared/ui/ui.module';
import { EcommerceService } from '../../../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from '../../../orders/transaction.service';
import { NgbdSortableHeader, SortEvent } from '../../../sortable-directive';
import { AddAttributeToSetComponent } from '../../../modals/add-attribute-to-set/add-attribute-to-set.component';
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
    NgbModalModule, HbSwitchComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-attribute-listing',
  templateUrl: './attribute-listing.component.html',
  styleUrls: ['./attribute-listing.component.scss'],
  providers: [TransactionService, DecimalPipe]
})
export class AttributeListingComponent implements OnInit {

  dataArray = [];
  attributeSetId: string;

  attributeFormGroup: FormGroup;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    public service: TransactionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: EcommerceService,
    private toaster: ToastrService,
    private modalService: NgbModal
  ) {

    this.route.params.subscribe((res:any)=>{
      this.attributeSetId = res.id;
    });
  
    this.attributeFormGroup = this.formBuilder.group({
      name: ["",[Validators.required]],
      attributeSetId: this.attributeSetId,
      isFilterable: true,
    })
  }

  async ngOnInit() {
  this.attributeSetId ? 
  this.getAttributeList()
  : '';
  }

  getAttributeList(){
    firstValueFrom(this.apiService.getAttributes(this.attributeSetId))
    .then((res:any)=>{
      if(res.data.attributes){
        this.dataArray = res.data.attributes;
      }
    })
    .catch((err:any)=>{
      this.toaster.error(err.error);
    });
  }

  editAttribute(data){
    const modalRef = this.modalService
    .open(AddAttributeToSetComponent, { size: "lg" });
    
    modalRef.componentInstance.data = data;
    
    modalRef.result.then(
      (result) => {
        if (result == true) {
          this.getAttributeList();
        }
      },
      (reason) => {
        console.log("reason", reason);
      }
    );
  }

  addAttribute(){
    if(this.attributeFormGroup.valid){
      const data = {
        ...this.attributeFormGroup.value
      };
      firstValueFrom(this.apiService.addAttribute(data))
      .then((res:any)=>{
        this.attributeFormGroup.patchValue({name:''});
        this.getAttributeList();
        this.toaster.success(res?.message);
      })
      .catch((err:any)=>{
        this.toaster.error(err.error.error);
      });
    }
    else{
      this.toaster.error('Attribute name is required');
    }
  }

  deleteAttribute(id){
    console.log("Id",id);
    firstValueFrom(this.apiService.deleteAttribute(id))
    .then((res:any)=>{
      this.toaster.success(res.message);
      this.getAttributeList();
    })
    .catch((err:any)=>{
      this.toaster.error(err.error);
    });
  }

  onSort({ column, direction }: SortEvent) {


    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
