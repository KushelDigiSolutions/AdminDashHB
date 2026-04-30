import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosticBookingsComponent } from './diagnostic-bookings/diagnostic-bookings.component';
import { DiagnosticsComponent } from './diagnostics.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule, NgbTypeaheadModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';
import { SearchFilterPipe } from 'src/app/core/pipes/search-filter.pipe';
import { RxjsInputModule } from 'src/app/components/rxjs-input/rxjs-input.module';
import { DiagnosticCancellationRequestsComponent } from './diagnostic-cancellation-requests/diagnostic-cancellation-requests.component';
import { CreateDiagnosticBookingComponent } from './create-diagnostic-booking/create-diagnostic-booking.component';
import {  } from 'ngx-intl-tel-input';
import { CreateDiagnosticTestComponent } from './create-diagnostic-test/create-diagnostic-test.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DiagnosticsComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'DiagnosticEditor'] } },
  { path: 'edit/:id', component: CreateDiagnosticTestComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'DiagnosticEditor'] } },
  { path: 'bookings', component: DiagnosticBookingsComponent, canActivate: [AuthGuard], data: { role: ['Admin'] } },
  { path: 'bookings/edit/:id', component: CreateDiagnosticBookingComponent, canActivate: [AuthGuard], data: { role: ['Admin'] } },
]

@NgModule({
  declarations: [
    DiagnosticBookingsComponent,
    DiagnosticsComponent,
    DiagnosticCancellationRequestsComponent,
    CreateDiagnosticBookingComponent,
    CreateDiagnosticTestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    UIModule,
    NgbModule,
    NgbTypeaheadModule,
    FormsModule,
    HbSwitchComponent,
    SearchFilterPipe,
    RxjsInputModule,
    NgbDropdownModule,
    NgbPaginationModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    RouterModule
  ]
})
export class DiagnosticsModule { }
