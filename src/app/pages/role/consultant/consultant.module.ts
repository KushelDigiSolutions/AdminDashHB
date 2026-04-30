import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultantRoutingModule } from './consultant-routing.module';
import { ProfileComponent } from './profile/profile.component'
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScheduleTimingsComponent } from './schedule-timings/schedule-timings.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbPaginationModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {  NgxMaskDirective, provideNgxMask  } from 'ngx-mask';
import { AvailableTimingsComponent } from './available-timings/available-timings.component';
import { ConsultantAppointmentsComponent } from './consultant-appointments/consultant-appointments.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ViewAppointmentModule } from 'src/app/components/view-appointment/view-appointment.module';
import { AccountsComponent } from './accounts/accounts.component';
import { ChangePasswordModule } from 'src/app/components/change-password/change-password/change-password.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';


@NgModule({
  declarations: [
    ProfileComponent,
    ScheduleTimingsComponent,
    AvailableTimingsComponent,
    ConsultantAppointmentsComponent,
    AccountsComponent,
  ],
  imports: [
    CommonModule,
    ConsultantRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ViewAppointmentModule,
    UIModule,
    NgSelectModule,
    NgxDropzoneModule,
    DropzoneModule,
    NgbModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgxMaskDirective,
    SimplebarAngularModule,
    FullCalendarModule,
    NgApexchartsModule,
    ChangePasswordModule,
  ],
  providers: [provideNgxMask()]
})
export class ConsultantModule { }
