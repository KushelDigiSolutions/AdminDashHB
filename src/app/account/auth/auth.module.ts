import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { SignupComponent } from './signup/signup.component';
import {  } from 'ngx-intl-tel-input';
import { CountdownModule } from 'src/app/components/countdown/countdown.module';

@NgModule({
  declarations: [LoginComponent, PasswordresetComponent, SignupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UIModule,
    
    CountdownModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
