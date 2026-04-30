import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSpecialityComponent } from './add-speciality/add-speciality.component';
import { SpecialityComponent } from './speciality.component';
import { RouterModule, Routes } from '@angular/router';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchFilterPipe } from 'src/app/core/pipes/search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
// import { // Ng5SliderModule } from "ng5-slider";
import { TranslateModule } from '@ngx-translate/core';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

const routes: Routes = [
  {
    path: '',
    component: SpecialityComponent
  },
  {
    path: 'add-speciality',
    component: AddSpecialityComponent
  },
  {
    path: 'edit/:id',
    component: AddSpecialityComponent
  },
];

@NgModule({
  declarations: [AddSpecialityComponent, SpecialityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    SearchFilterPipe,
    NgbDropdownModule,
    HbSwitchComponent,
    TranslateModule,
    // // Ng5SliderModule,
    NgSelectModule,
    
    NgbPaginationModule,
    NgbTooltipModule,
    CKEditorModule,
    NgxDropzoneModule,
  ]
})
export class SpecialityModule { }
