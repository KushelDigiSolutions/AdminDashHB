import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthPackagesComponent } from './health-packages.component';
import { RouterModule, Routes } from '@angular/router';
import { AddHealthPackageComponent } from './add-health-package/add-health-package.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbAccordionModule, NgbModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';

const routes: Routes = [
  { path: '', component: HealthPackagesComponent },
  { path: 'add-health-package', component: AddHealthPackageComponent },
  { path: ':id', component: AddHealthPackageComponent }
]

@NgModule({
  declarations: [HealthPackagesComponent, AddHealthPackageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgSelectModule,
    
    CKEditorModule,
    NgbAccordionModule,
    NgbPaginationModule,
    UIModule,
    NgbTypeaheadModule,
    NgbModule,
    DropzoneModule,
    HbSwitchComponent,
  ],
})
export class HealthPackagesModule { }
