import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService,
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        const currentUser = this.authenticationService.currentUser();

        if (currentUser) {
            if (route.data.role) {
                var set = new Set();
                currentUser.role.forEach(role => set.add(role));
                route.data.role.forEach(role => set.add(role));
                if (set.size < (currentUser.role.length + route.data.role.length)) {
                    return true;
                }

                this.router.navigate([currentUser.role.includes('CorporateUser') ? '/corporate' : '/dashboard'], { replaceUrl: true });
                return false;
            }
            return true;
        } else {
            this.router.navigate(['/account/login'], { replaceUrl: true });
            return false
        }
    }
}
