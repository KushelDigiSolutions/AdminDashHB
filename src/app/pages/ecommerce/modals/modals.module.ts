import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewDateComponent } from './new-date/new-date.component';
import { SeasonSpecialComponent } from './season-special/season-special.component';
import { AddAttributeComponent } from './add-attribute/add-attribute.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddVariationComponent } from './add-variation/add-variation.component';
import { AddAttributeToSetComponent } from './add-attribute-to-set/add-attribute-to-set.component';
import { AddTypesComponent } from './add-types/add-types.component';
import { RemoveModalComponent } from './remove/remove-modal/remove-modal.component';
import { RefundModalComponent } from './refund/refund-modal/refund-modal.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [],
  imports: [
    CommonModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule,
    NewDateComponent,
    SeasonSpecialComponent, 
    AddAttributeComponent, 
    AddVariationComponent, 
    AddAttributeToSetComponent, 
    AddTypesComponent, 
    RemoveModalComponent, 
    RefundModalComponent
  ],
  providers: [
  ],
  exports: [NewDateComponent,SeasonSpecialComponent]
})
export class ModalsModule { }
