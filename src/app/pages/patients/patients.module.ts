import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
  NgbModule, 
  NgbPaginationModule, 
  NgbModalModule, 
  NgbDatepickerModule, 
  NgbAlertModule, 
  NgbTooltipModule 
} from '@ng-bootstrap/ng-bootstrap';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { PatientsComponent } from './patients/patients.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { CreateAppointmentForPatientComponent } from './create-appointment-for-patient/create-appointment-for-patient.component';
import { AddHealthStatsComponent } from './patient-detail/components/add-health-stats/add-health-stats.component';
import { HealthStatsComponent } from './patient-detail/components/health-stats/health-stats.component';
import { VitalChartComponent } from './patient-detail/components/vital-chart/vital-chart.component';

import { UIModule } from '../../shared/ui/ui.module';
import { RxjsInputModule } from 'src/app/components/rxjs-input/rxjs-input.module';
import { ViewPrescriptionModule } from 'src/app/components/view-prescription/view-prescription.module';
import { ViewMedicalRecordModule } from 'src/app/components/view-medical-record/view-medical-record.module';

const routes: Routes = [
  { path: '', component: PatientsComponent, pathMatch: 'full' },
  { path: 'create', component: CreatePatientComponent, pathMatch: 'full' },
  { path: ':userId/create-appointment', component: CreateAppointmentForPatientComponent },
  { path: ':id', component: PatientDetailComponent }
];

@NgModule({
  declarations: [
    PatientsComponent,
    PatientDetailComponent,
    CreatePatientComponent,
    CreateAppointmentForPatientComponent,
    AddHealthStatsComponent,
    HealthStatsComponent,
    VitalChartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    RxjsInputModule,
    ViewPrescriptionModule,
    ViewMedicalRecordModule,
    NgbModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbAlertModule,
    NgbTooltipModule,
    FullCalendarModule,
    NgApexchartsModule,
    NgSelectModule,
    NgxDropzoneModule,
    NgxMaskDirective,
    NgxIntlTelInputModule
  ],
  providers: [
    provideNgxMask(),
    DecimalPipe
  ],
  exports: [
    RouterModule
  ]
})
export class PatientsModule { }
