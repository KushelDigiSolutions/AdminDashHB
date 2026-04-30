import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: false,
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  deleteData;

  @Input() 
  set data(data:any){
    this.deleteData =  data;
  }
  get data():any{
    return this.deleteData
  };
  constructor(
    private activeModal : NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  fetchValue(value){
    this.activeModal.close(value);
  }

}
