import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ScheduleTimingsComponent } from './schedule-timings/schedule-timings.component';
import { AvailableTimingsComponent } from './available-timings/available-timings.component';
import { ConsultantAppointmentsComponent } from './consultant-appointments/consultant-appointments.component';
import { ViewAppointmentComponent } from 'src/app/components/view-appointment/view-appointment.component';
import { AccountsComponent } from './accounts/accounts.component';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password/change-password.component';

const routes: Routes = [
  { path: 'appointments', component: ConsultantAppointmentsComponent },
  { path: 'appointments/:id', component: ViewAppointmentComponent },
  { path: 'profile-settings', component: ProfileComponent },
  { path: 'available-timings', component: AvailableTimingsComponent },
  { path: 'schedule-timings', component: ScheduleTimingsComponent },
  { path: 'subscribed-health-packages', loadChildren: () => import('../../../components/subscribed-health-packages/subscribed-health-packages.module').then(m => m.SubscribedHealthPackagesModule) },
  { path: 'accounts', component: AccountsComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'health-packages', loadChildren: () => import('../../cms/health-packages/health-packages.module').then(m => m.HealthPackagesModule) }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class ConsultantRoutingModule { }
