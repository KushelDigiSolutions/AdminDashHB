import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { CorporateUserRoutingModule } from './corporate-user-routing.module';
import { WebinarsComponent } from './webinars/webinars.component';



@NgModule({
  declarations: [HomeComponent, WebinarsComponent],
  imports: [
    CommonModule,
    CorporateUserRoutingModule,
  ]
})
export class CorporateUserModule { }
