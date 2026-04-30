import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationPipe } from './consultation.pipe';



@NgModule({
  declarations: [
    ConsultationPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConsultationPipe,
  ]
})
export class ConsultationPipeModule { }
