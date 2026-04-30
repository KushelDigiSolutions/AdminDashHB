import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule,
  ],
  exports: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
