import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RemoveModalComponent } from '../../ecommerce/modals/remove/remove-modal/remove-modal.component';
import { NgbdSortableHeader, SortEvent } from '../../ecommerce/sortable-directive';
import { CmsService } from '../cms.service';

@Component({
  standalone: false,
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.scss']
})
export class MetasComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tempsearchTerm;

  dataArray:Array<{}>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private cmsService: CmsService,
    private modal: NgbModal,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.breadCrumbItems = [{ label: 'Metas' }, { label: 'Metas List', active: true }];
      this.getMetaList();
    });
  }

  getMetaList(){
    this.cmsService.getMetaData().subscribe((res:any)=>{
        setTimeout(() => {
          this.dataArray = res.data;
          this.cdr.detectChanges();
        });
    }, (err:HttpErrorResponse)=>{

    })
  }

  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

  }

  removeMeta(id){

    const data = {
      value: 'meta',
      type: 'blog'
    }

    let modal = this.modal.open(RemoveModalComponent, {size:'lg'});

    modal.componentInstance.data = data;

    modal.result.then((result)=>{
      if(result=='yes'){
        this.cmsService.removeMeta(id).subscribe((res:any)=>{
          setTimeout(() => {
            this.toaster.success(res.message);
            this.getMetaList();
            this.cdr.detectChanges();
          });
        }, (err:HttpErrorResponse)=>{
          this.toaster.error("Something went wrong");
        })
      }
    })
  }

}
