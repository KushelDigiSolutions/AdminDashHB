import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationTemplatesComponent } from './notification-templates.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {  NgxMaskDirective, provideNgxMask  } from 'ngx-mask';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { AddNotificationTemplateComponent } from './add-notification-template/add-notification-template.component';
import { DropzoneModule } from '../dropzone/dropzone.module';
import { RxjsInputModule } from '../rxjs-input/rxjs-input.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: NotificationTemplatesComponent },
  { path: 'create', component: AddNotificationTemplateComponent },
  { path: 'edit/:id', component: AddNotificationTemplateComponent },
]

@NgModule({
  declarations: [
    NotificationTemplatesComponent,
    AddNotificationTemplateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgSelectModule,
    NgbModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgxMaskDirective,
    DropzoneModule,
    RxjsInputModule,
  ],
  exports: [
    RouterModule
  ]
})
export class NotificationTemplatesModule { }
