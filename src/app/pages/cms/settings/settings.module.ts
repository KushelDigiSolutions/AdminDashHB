import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSettingsComponent } from './add-settings/add-settings.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TranslateModule } from '@ngx-translate/core';

const routes:Routes = [
  {path: '', component: SettingsComponent},
  {path: 'add-new', component: AddSettingsComponent},
  {path: 'edit-setting/:id', component: AddSettingsComponent}
]

@NgModule({
  declarations: [SettingsComponent, AddSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    TranslateModule
  ]
})
export class SettingsModule { }
