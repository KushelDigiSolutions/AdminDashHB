import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LifeStyleCategoryListComponent } from './life-style-category-list/life-style-category-list.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';
import { AddLifestyleCategoryComponent } from './add-lifestyle-category/add-lifestyle-category.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';

const routes: Routes = [
  {path: '',component: LifeStyleCategoryListComponent},
  {path: 'add-lifeStyle-category',component: AddLifestyleCategoryComponent},
  {path: 'edit/:id',component: AddLifestyleCategoryComponent},
] 

@NgModule({
  declarations: [LifeStyleCategoryListComponent, AddLifestyleCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UIModule,
    NgSelectModule,
    
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    TranslateModule,
    NgbPaginationModule,
    NgxDropzoneModule,
    HbSwitchComponent
  ]
})
export class LifeStyleCategoriesModule { }
