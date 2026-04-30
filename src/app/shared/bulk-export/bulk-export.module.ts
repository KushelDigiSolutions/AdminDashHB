import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkExportComponent } from './bulk-export.component';



@NgModule({
  declarations: [BulkExportComponent],
  imports: [
    CommonModule
  ],
  exports: [BulkExportComponent]
})
export class BulkExportModule { }
