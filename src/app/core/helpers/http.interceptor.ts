import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class PublicInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let serverReq: HttpRequest<any> = request;

    let token = localStorage.getItem('token');
    let headers: any = {
      url: serverReq.url,
      apikey: environment.apikey
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    serverReq = serverReq.clone({
      setHeaders: headers
    });

    return next.handle(serverReq);
  }
}
