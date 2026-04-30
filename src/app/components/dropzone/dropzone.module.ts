import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { DropzoneComponent } from './dropzone.component';



@NgModule({
  declarations: [DropzoneComponent],
  imports: [
    CommonModule,
    NgxDropzoneModule,
  ],
  exports: [DropzoneComponent]
})
export class DropzoneModule { }
