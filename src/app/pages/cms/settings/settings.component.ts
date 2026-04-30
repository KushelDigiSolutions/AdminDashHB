import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RemoveModalComponent } from '../../ecommerce/modals/remove/remove-modal/remove-modal.component';
import { NgbdSortableHeader, SortEvent } from '../../ecommerce/sortable-directive';
import { CmsService } from '../cms.service';

@Component({
  standalone: false,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tempsearchTerm;

  dataArray:Array<{}>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private cmsService: CmsService,
    private modal: NgbModal,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'settings List', active: true }];
    this.getSettingList();
  }

  getSettingList(){
    this.cmsService.getSettings().subscribe((res:any)=>{
        this.dataArray = res.data;
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

  removeSetting(id){

    const data = {
      value: 'setting',
      type: 'setting'
    }

    let modal = this.modal.open(RemoveModalComponent, {size:'lg'});

    modal.componentInstance.data = data;

    modal.result.then((result)=>{
      if(result=='yes'){
        this.cmsService.removeSetting(id).subscribe((res:any)=>{
          this.toaster.success(res.message);
          this.getSettingList();
        }, (err:HttpErrorResponse)=>{
          this.toaster.error("Something went wrong");
        })  
      }
    })
  }

}
