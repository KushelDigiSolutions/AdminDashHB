import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsListingComponent } from './doctors-listing/doctors-listing.component';
import { AddDoctorsComponent } from './add-doctors/add-doctors.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from '../../shared/ui/ui.module';

import { SearchFilterPipe } from 'src/app/core/pipes/search-filter.pipe';
import { NgbModule, NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbAccordionModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgSelectModule } from '@ng-select/ng-select';

import { HbSwitchComponent } from "src/app/shared/ui/hb-switch/hb-switch.component";

import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DoctorAppointmentTabComponent } from './doctor-appointment-tab/doctor-appointment-tab.component';
import { DoctorReviewComponent } from './doctor-review/doctor-review.component';
import { PendingDoctorRequestComponent } from './pending-doctor-request/pending-doctor-request.component';
import { ViewImageComponent } from './modals/view-image/view-image.component';
import { PayoutsComponent } from './payouts/payouts.component';
import { AddPayoutComponent } from './payouts/add-payout/add-payout.component';
import { EarningListComponent } from './earning-list/earning-list.component';
import { ConsultantSpecializationComponent } from './consultant-specialization/consultant-specialization.component';
import { AddSpecializationComponent } from './consultant-specialization/add-specialization/add-specialization.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ConsultantPipeModule } from 'src/app/core/pipes/consultant/consultantPipe.module';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';


const routes: Routes = [
  { path: '', component: DoctorsListingComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'] } },
  { path: 'add-doctor', component: AddDoctorsComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'] } },
  { path: 'edit/:id', component: AddDoctorsComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'] } },
  { path: 'pending-doctor', component: PendingDoctorRequestComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultUsAdmin'] } },
  { path: 'payouts', component: PayoutsComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultUsAdmin'] } },
  { path: 'earning-list', component: EarningListComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultUsAdmin'] } },
  { path: 'payouts/add-payout', component: AddPayoutComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultUsAdmin'] } },
  { path: 'payouts/edit/:id', component: AddPayoutComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultUsAdmin'] } },
  { path: 'specialization', component: ConsultantSpecializationComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'] } }
]

@NgModule({
  declarations: [DoctorsListingComponent, AddDoctorsComponent, DoctorAppointmentTabComponent, DoctorReviewComponent, PendingDoctorRequestComponent, ViewImageComponent, PayoutsComponent, AddPayoutComponent, EarningListComponent, ConsultantSpecializationComponent, AddSpecializationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    HbSwitchComponent,
    NgbDropdownModule,
    NgSelectModule,
    
    NgbNavModule,
    NgbAccordionModule,
    NgbPaginationModule,
    SearchFilterPipe,
    SimplebarAngularModule,
    NgbTypeaheadModule,
    NgbModule,
    TranslateModule,
    NgxDropzoneModule,
    ConsultantPipeModule,
    DropzoneModule,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorsModule { }
