import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxjsInputComponent } from './rxjs-input.component';



@NgModule({
  declarations: [
    RxjsInputComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RxjsInputComponent,
  ]
})
export class RxjsInputModule { }
