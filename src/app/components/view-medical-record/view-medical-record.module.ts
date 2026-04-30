import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMedicalRecordComponent } from './view-medical-record.component';



@NgModule({
  declarations: [
    ViewMedicalRecordComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ViewMedicalRecordComponent,
  ]
})
export class ViewMedicalRecordModule { }
