import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule, NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';

import { UIModule } from '../../shared/ui/ui.module';
import { LifestyleRoutingModule } from './lifestyle-routing.module';
import { LifestyleComponent } from './lifestyle.component';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { BlogPoolComponent } from './blog-pool/blog-pool.component';
import { AddBlogComponent } from './add-blog/add-blog.component';

@NgModule({
  declarations: [
    LifestyleComponent, 
    ViewBlogComponent,
    BlogPoolComponent,
    AddBlogComponent
  ],
  imports: [
    CommonModule,
    LifestyleRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbModule,
    NgSelectModule,
    TranslateModule,
    NgxDropzoneModule,
    CKEditorModule,
    HbSwitchComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class LifestyleModule { }
