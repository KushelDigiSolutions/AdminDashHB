import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';
import { BulkExportComponent } from './bulk-export/bulk-export.component';
import { BulkExportModule } from './bulk-export/bulk-export.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UIModule,
    BulkExportModule
  ],
})

export class SharedModule { }
