import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribedHealthPackagesComponent } from './subscribed-health-packages.component';
import { SubscribedHealthPackageComponent } from './subscribed-health-package/subscribed-health-package.component';
import { SubscribedHealthPackageNotificationsComponent } from './subscribed-health-package-notifications/subscribed-health-package-notifications.component';
import { RouterModule, Routes } from '@angular/router';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbAlertModule, NgbModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ConsultantPipeModule } from 'src/app/core/pipes/consultant/consultantPipe.module';
import { ConsultationPipeModule } from 'src/app/core/pipes/consultation-pipe/consultation-pipe.module';
import { InsightsChartComponent } from './subscribed-health-package/components/insights-chart/insights-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';
import { DropzoneModule } from '../dropzone/dropzone.module';
import { CreateHealthPackageSubscriptionComponent } from './create-health-package-subscription/create-health-package-subscription.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: '', component: SubscribedHealthPackagesComponent, },
  { path: 'create', component: CreateHealthPackageSubscriptionComponent, },
  { path: ':id/notifications', component: SubscribedHealthPackageNotificationsComponent, },
  { path: ':id', component: SubscribedHealthPackageComponent, },
]


@NgModule({
  declarations: [
    SubscribedHealthPackagesComponent,
    SubscribedHealthPackageComponent,
    SubscribedHealthPackageNotificationsComponent,
    InsightsChartComponent,
    CreateHealthPackageSubscriptionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FullCalendarModule,
    SimplebarAngularModule,
    ConsultantPipeModule,
    ConsultationPipeModule,
    NgApexchartsModule,
    NgbAlertModule,
    HbSwitchComponent,
    DropzoneModule,
    NgSelectModule,
    NgbAlertModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class SubscribedHealthPackagesModule { }
