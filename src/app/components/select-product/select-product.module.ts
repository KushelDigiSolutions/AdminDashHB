import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectProductComponent } from './select-product.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [SelectProductComponent],
  imports: [
    CommonModule,
    NgSelectModule,
  ],
  exports: [SelectProductComponent]
})
export class SelectProductModule { }
