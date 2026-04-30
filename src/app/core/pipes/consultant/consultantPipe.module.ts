import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultantPipe } from './consultant.pipe';



@NgModule({
  declarations: [
    ConsultantPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConsultantPipe
  ]
})
export class ConsultantPipeModule { }
