import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';
import { ContactsRoutingModule } from './contacts-routing.module';

import { UsergridComponent } from './usergrid/usergrid.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ProfileComponent } from './profile/profile.component';

import { SearchFilterPipe } from 'src/app/core/pipes/search-filter.pipe';
import { NgbModule, NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbAccordionModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [UsergridComponent, UserlistComponent, ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactsRoutingModule,
    // WidgetModule,
    UIModule,
    NgApexchartsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgSelectModule,
    
    NgbNavModule,
    NgbAccordionModule,
    NgbPaginationModule,
    SearchFilterPipe,
    SimplebarAngularModule,
    NgbTypeaheadModule,
    NgbModule
  ]
})
export class ContactsModule { }
