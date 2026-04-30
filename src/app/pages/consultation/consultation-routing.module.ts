import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './appointment/appointment.component';
import { CreateAppointmentComponent } from './appointment/create-appointment/create-appointment.component';
import { ViewAppointmentComponent } from '../../components/view-appointment/view-appointment.component';
import { PayoutsComponent } from './payouts/payouts.component';

const routes: Routes = [
  { path: '', pathMatch: "full", redirectTo: '/dashboard' },
  {
    path: 'appointment',
    component: AppointmentComponent
  },
  {
    path: 'create-appointment',
    component: CreateAppointmentComponent
  },
  {
    path: 'appointment/edit/:id',
    component: CreateAppointmentComponent
  },
  {
    path: 'appointment/:id',
    component: ViewAppointmentComponent
  },
  {
    path: 'payouts',
    component: PayoutsComponent,
    data: { role: ['Admin', 'ConsultUsAdmin'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationRoutingModule { }
