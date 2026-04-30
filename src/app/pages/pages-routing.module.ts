import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DefaultComponent, data: { role: ['Admin', 'Consultant'] } },
  { path: 'assessments', loadChildren: () => import('./assessments/assessments.module').then(m => m.AssessmentsModule), canActivate: [AuthGuard], data: { role: ['Admin'] } },
  { path: 'calendar', component: CalendarComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule), data: { role: ['Admin', 'Consultant'] } },
  { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule), canActivate: [AuthGuard], data: { role: ['Admin', 'Accountant', 'CMSManager', 'ProductManager'] } },
  { path: 'consultation', loadChildren: () => import('./consultation/consultation.module').then(m => m.ConsultationModule), canActivate: [AuthGuard], data: { role: ['Admin', 'Accountant', 'ConsultUsAdmin', 'ConsultationsManager'] } },
  { path: 'patients', loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule), canActivate: [AuthGuard], data: { role: ['Admin', 'Consultant'] } },
  { path: 'speciality', loadChildren: () => import('./cms/speciality/speciality.module').then(m => m.SpecialityModule), canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'] } },
  { path: 'lifeStyleCategories', loadChildren: () => import('./cms/life-style-categories/life-style-categories.module').then(m => m.LifeStyleCategoriesModule), canActivate: [AuthGuard], data: { role: ['Admin', 'CMSManager'] } },
  { path: 'metas', loadChildren: () => import('./cms/metas/metas.module').then(m => m.MetasModule), canActivate: [AuthGuard], data: { role: ['Admin', 'CMSManager'] } },
  { path: 'settings', loadChildren: () => import('./cms/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard], data: { role: ['Admin', 'CMSManager'] } },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [AuthGuard], data: { role: ['Admin', 'Consultant', 'CMSManager', 'HealthpackageEditor'] } },
  { path: 'health-packages', loadChildren: () => import('./cms/health-packages/health-packages.module').then(m => m.HealthPackagesModule), canActivate: [AuthGuard], data: { role: ['Admin', 'CMSManager', 'HealthpackageEditor'] } },
  { path: 'subscribed-health-packages', loadChildren: () => import('../components/subscribed-health-packages/subscribed-health-packages.module').then(m => m.SubscribedHealthPackagesModule), canActivate: [AuthGuard], data: { role: ['Admin', 'CMSManager', 'HealthpackageEditor'] } },
  { path: 'doctors', loadChildren: () => import('./doctors/doctors.module').then(m => m.DoctorsModule), canActivate: [AuthGuard], data: { role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'] } },
  { path: 'diagnostics', loadChildren: () => import('./diagnostics/diagnostics.module').then(m => m.DiagnosticsModule), canActivate: [AuthGuard], data: { role: ['Admin', 'DiagnosticEditor'] } },
  { path: 'lifestyle', loadChildren: () => import('./lifestyle/lifestyle.module').then(m => m.LifestyleModule), canActivate: [AuthGuard], data: { role: ['Admin', 'Writer', 'Author', 'Editor', 'Publisher', 'CMSManager'] } },
  { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule), canActivate: [AuthGuard], data: { role: ['Admin'] } },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule), canActivate: [AuthGuard], data: { role: ['Admin'] } },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule), canActivate: [AuthGuard], data: { role: ['Admin', 'Editor'] } },
  { path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
  { path: 'consultant', loadChildren: () => import('./role/consultant/consultant.module').then(m => m.ConsultantModule), canActivate: [AuthGuard], data: { role: ['Consultant'] } },
  { path: 'admin/corporate', loadChildren: () => import('./corporate/corporate.module').then(m => m.CorporateModule), canActivate: [AuthGuard], data: { role: ['Admin', 'CorporateManager'] } },
  { path: 'corporate', loadChildren: () => import('./role/corporate-user/corporate-user.module').then(m => m.CorporateUserModule), canActivate: [AuthGuard], data: { role: ['CorporateUser'] } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
