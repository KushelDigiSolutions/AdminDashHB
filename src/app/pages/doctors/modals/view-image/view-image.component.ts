import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit {

  s3Base = environment.imageUrl;

  dataJson:any;

  @Input()
  set data(data:any){
    this.dataJson = data;
  }
  get data():any{
    return this.dataJson;
  }
  

  constructor() { }

  ngOnInit(): void {
  }

}
