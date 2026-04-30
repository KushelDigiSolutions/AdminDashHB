import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { WebinarsComponent } from './webinars/webinars.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard], data: { role: ['CorporateUser'] } },
  { path: 'webinars', component: WebinarsComponent, canActivate: [AuthGuard], data: { role: ['CorporateUser'] } },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class CorporateUserRoutingModule { }
