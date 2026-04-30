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
import { UIModule } from '../../../../shared/ui/ui.module';
import { EcommerceService } from '../../ecommerce.service';
import { TransactionService } from '../../orders/transaction.service';
import { Transaction } from '../../orders/transaction';
import { NgbdSortableHeader } from '../../sortable-directive';
import { Observable, firstValueFrom } from 'rxjs';
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
  selector: 'app-related-blogs',
  templateUrl: './related-blogs.component.html',
  styleUrls: ['./related-blogs.component.scss'],
  providers: [TransactionService, DecimalPipe]
})
export class RelatedBlogsComponent implements OnInit {

  @Input() blogs;
  dataArray = [];
  relatedBlogs = [];

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  @Output() newItemEvent:any = new EventEmitter<any>(); 

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    public service: TransactionService,
    private apiService: EcommerceService
  ) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
   }

  ngOnInit(){
    console.log("blgs",this.blogs);
    this.getBlogs();
  }

  getBlogs(){
    firstValueFrom(this.apiService.getBlogList())
    .then((res:any)=>{
      if(res.data){
        this.dataArray = res.data;
        for(let k in this.dataArray){
          this.dataArray[k].related = false;

          if(this.blogs.length){
            for(let j in this.blogs){
              if(this.dataArray[k]._id == this.blogs[j]._id){
                this.dataArray[k].related = !this.dataArray[k].related;
                this.relatedBlogs.push(this.dataArray[k]._id);
              }
            }
          }

        }
      }
    })
    .catch((err:any)=>{
      console.log("err",err);
    })
  }

  toggleFxn(item){
    item.related = !item.related;
    if(item.related){
      this.relatedBlogs.push(item._id);
    }
    else if(!item.related){
      this.relatedBlogs.forEach(element => {
        if(item._id == element){
          this.relatedBlogs.splice(this.relatedBlogs.indexOf(element),1)
        }
      });
    }

    this.newItemEvent.emit(this.relatedBlogs);

  }

}
