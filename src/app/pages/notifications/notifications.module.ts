import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { RouterModule, Routes } from '@angular/router';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { FormsModule } from '@angular/forms';
import { RxjsInputModule } from 'src/app/components/rxjs-input/rxjs-input.module';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'list',
  },
  {
    path: 'list', component: NotificationsComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'CMSManager','HealthpackageEditor'] },
  },
  {
    path: 'templates', loadChildren: () => import('../../components/notification-templates/notification-templates.module').then(m => m.NotificationTemplatesModule), canActivate: [AuthGuard], data: { role: ['Admin', 'Consultant', 'CMSManager','HealthpackageEditor'] },
  },
  {
    path: 'create', loadChildren: () => import('./push-notifications/push-notifications.module').then(m => m.PushNotificationsModule),
  },
  {
    path: ':id', loadChildren: () => import('./push-notifications/push-notifications.module').then(m => m.PushNotificationsModule),
  },
]

@NgModule({
  declarations: [
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    UIModule,
    NgbModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    RxjsInputModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class NotificationsModule { }
