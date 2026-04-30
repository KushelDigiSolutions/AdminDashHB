import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewAppointmentComponent } from './view-appointment.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbDatepickerModule, NgbModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SelectProductModule } from '../select-product/select-product.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ConsultantPipeModule } from 'src/app/core/pipes/consultant/consultantPipe.module';
import { ViewPrescriptionModule } from '../view-prescription/view-prescription.module';
import { ViewMedicalRecordModule } from '../view-medical-record/view-medical-record.module';



@NgModule({
  declarations: [
    ViewAppointmentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ConsultantPipeModule,
    SelectProductModule,
    UIModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgSelectModule,
    
    NgbModule,
    NgbDatepickerModule,
    CKEditorModule,
    NgxMaskDirective,
    ViewPrescriptionModule,
    ViewMedicalRecordModule,
  ],
  providers: [provideNgxMask()], 
 exports: [
    ViewAppointmentComponent,
  ]
})
export class ViewAppointmentModule { }
