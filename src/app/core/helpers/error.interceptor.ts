import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { empty, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService,
        private router: Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.toastr.error('Please Login.', 'Session expired!');
                this.authFackservice.logout();
                this.router.navigate(['/account/login']);
            }

            // const error = err.error.message || err.statusText;
            return throwError(() => err);
            // return empty();
        }));
    }
}
