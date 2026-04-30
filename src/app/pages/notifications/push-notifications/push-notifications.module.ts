import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushNotificationsComponent } from './push-notifications.component';
import { RouterModule, Routes } from '@angular/router';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
  { path: '', component: PushNotificationsComponent },
]

@NgModule({
  declarations: [
    PushNotificationsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgSelectModule,
    
    UIModule,
    NgxDropzoneModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class PushNotificationsModule { }
