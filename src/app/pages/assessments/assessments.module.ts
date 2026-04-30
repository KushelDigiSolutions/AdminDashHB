import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsComponent } from './assessments.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';

import { AddAssessmentComponent } from './add-assessment/add-assessment.component';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { ViewAssessmentResponseComponent } from './view-assessment-response/view-assessment-response.component';
import {  } from 'ng2-charts';

const routes: Routes = [
  { path: '', component: AssessmentsComponent },
  { path: 'create', component: AddAssessmentComponent },
  { path: 'edit/:id', component: AddAssessmentComponent },
  { path: 'response/:id', component: ViewAssessmentResponseComponent },
]

@NgModule({
  declarations: [
    AssessmentsComponent,
    AddAssessmentComponent,
    ViewAssessmentResponseComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbPaginationModule,
    NgSelectModule,
    HbSwitchComponent,
    NgbTypeaheadModule,
    NgbModule,
    
    DropzoneModule,
    
  ],
  exports: [
    RouterModule,
  ]
})
export class AssessmentsModule { }
