import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPrescriptionComponent } from './view-prescription.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ViewPrescriptionComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    // NgbModalModule,
  ],
  exports: [
    ViewPrescriptionComponent,
  ]
})
export class ViewPrescriptionModule { }
