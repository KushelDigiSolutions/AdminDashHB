import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetasComponent } from './metas.component';
import { RouterModule, Routes } from '@angular/router';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddMetasComponent } from './add-metas/add-metas.component';
import { NgbAccordionModule, NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: '', component: MetasComponent },
  { path: 'add-metas', component: AddMetasComponent},
  { path: 'edit-meta/:id', component: AddMetasComponent}
];

@NgModule({
  declarations: [MetasComponent, AddMetasComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    
    NgbDropdownModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbTooltipModule,
  ]
})
export class MetasModule { }
