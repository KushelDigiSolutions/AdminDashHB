import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgbDatepickerModule, NgbModalModule, NgbModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {  NgxMaskDirective } from 'ngx-mask';

import { UIModule } from 'src/app/shared/ui/ui.module';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyComponent } from './companies/add-company/add-company.component';
import { WebinarTemplatesComponent } from './webinar-templates/webinar-templates.component';
import { AddWebinarTemplateComponent } from './webinar-templates/add-webinar-template/add-webinar-template.component';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { WebinarsComponent } from './webinars/webinars.component';
import { AddWebinarComponent } from './webinars/add-webinar/add-webinar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CorporatePackagesComponent } from './corporate-packages/corporate-packages.component';
import { AddCorporatePackageComponent } from './corporate-packages/add-corporate-package/add-corporate-package.component';
import { CorporateLifestyleTipsComponent } from './corporate-lifestyle-tips/corporate-lifestyle-tips.component';
import { AddCorporateLifestyleTipsComponent } from './corporate-lifestyle-tips/add-corporate-lifestyle-tips/add-corporate-lifestyle-tips.component';
import { EmailsComponent } from './emails/emails.component';
import { AddEmailComponent } from './emails/add-email/add-email.component';
import { CampCollectionComponent } from './camp-collection/camp-collection.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CorporateDiagnosticComponent } from './corporate-diagnostic/corporate-diagnostic.component';

const routes: Routes = [
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/create', component: AddCompanyComponent },
  { path: 'companies/:id', component: AddCompanyComponent },
  { path: 'webinar-templates', component: WebinarTemplatesComponent },
  { path: 'webinar-templates/create', component: AddWebinarTemplateComponent },
  { path: 'webinar-templates/:id', component: AddWebinarTemplateComponent },
  { path: 'webinars', component: WebinarsComponent },
  { path: 'webinars/create', component: AddWebinarComponent },
  { path: 'webinars/:id', component: AddWebinarComponent },
  { path: 'packages', component: CorporatePackagesComponent },
  { path: 'packages/create', component: AddCorporatePackageComponent },
  { path: 'packages/:id', component: AddCorporatePackageComponent },
  { path: 'lifestyle-tips', component: CorporateLifestyleTipsComponent },
  { path: 'lifestyle-tips/create', component: AddCorporateLifestyleTipsComponent },
  { path: 'lifestyle-tips/:id', component: AddCorporateLifestyleTipsComponent },
  { path: 'emails', component: EmailsComponent },
  { path: 'emails/create', component: AddEmailComponent },
  { path: 'camp-collections/create', component: CampCollectionComponent },
  { path: 'camp-collections/:id', component: CampCollectionComponent },
  { path: 'diagnostics/create', component: CorporateDiagnosticComponent },
  { path: 'diagnostics/:id', component: CorporateDiagnosticComponent },
];

@NgModule({
  declarations: [
    CompaniesComponent,
    AddCompanyComponent,
    WebinarTemplatesComponent,
    AddWebinarTemplateComponent,
    WebinarsComponent,
    AddWebinarComponent,
    CorporatePackagesComponent,
    AddCorporatePackageComponent,
    CorporateLifestyleTipsComponent,
    AddCorporateLifestyleTipsComponent,
    EmailsComponent,
    AddEmailComponent,
    CampCollectionComponent,
    CorporateDiagnosticComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgxMaskDirective,
    NgbModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    NgSelectModule,
    NgbDatepickerModule,
    DropzoneModule,
    CKEditorModule,
    NgbModalModule,
    NgxIntlTelInputModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class CorporateModule { }
