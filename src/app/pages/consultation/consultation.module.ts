import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultationRoutingModule } from './consultation-routing.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalsModule } from '../ecommerce/modals/modals.module';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { SelectProductModule } from 'src/app/components/select-product/select-product.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PayoutsComponent } from './payouts/payouts.component';
import { ViewAppointmentModule } from 'src/app/components/view-appointment/view-appointment.module';
import { CreateAppointmentModule } from './appointment/create-appointment/create-appointment.module';


@NgModule({
  declarations: [
    AppointmentComponent,
    PayoutsComponent,
  ],
  imports: [
    CommonModule,
    ModalsModule,
    ConsultationRoutingModule,
    ViewAppointmentModule,
    CreateAppointmentModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbTypeaheadModule,
    NgSelectModule,
    
    NgbModule,
    SelectProductModule,
    SharedModule,
    
    CKEditorModule
  ]
})
export class ConsultationModule { }
