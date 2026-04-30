import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;

    constructor(
        private http: HttpClient
    ) { }

    setUser(user: User) {
        if (!user.role) user.role = [];
        else if (typeof user.role === 'string') user.role = [user.role as any];
        localStorage.setItem('token', user.token);
        localStorage.setItem('hbDashboardUser', JSON.stringify(user));
    }

    /**
     * Returns the current user
     */
    public currentUser(): User | null {
        var user = localStorage.getItem('hbDashboardUser');
        if (user) {
            let parsedUserObj: any = JSON.parse(user);
            if (!parsedUserObj.role) parsedUserObj.role = [];
            else if (typeof parsedUserObj.role === 'string') parsedUserObj.role = [parsedUserObj.role];
            return parsedUserObj;
        }
        return null;
        // return getFirebaseBackend().getAuthenticatedUser();
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(data) {
        return this.http.post(`${environment.apiUrl}auth/adminlogin`, data);
    }

    requestLoginOtp(data: { email: string }) {
        return this.http.post(`${environment.apiUrl}auth/resendOtp`, data);
    }
    
    loginUser(data) {
        return this.http.post(`${environment.apiUrl}auth/login`, data);
    }

    registerCorporateUser(data: { otp, email?, phone?, countryCode?, firstName?, lastName?, password, cartId }) {
        return this.http.post(`${environment.apiUrl}auth/corporate/register`, data);
    }
    checkuser(data: { email?: string, countryCode?: string, phone?: string }) {
        return this.http.post(`${environment.apiUrl}auth/checkuser`, data);
    }

    rolecheck(data: { email?: string, countryCode?: string, phone?: string }) {
        return this.http.post(`${environment.apiUrl}auth/checkrole`, data);
    }

    resendOtp(data: { email?: string, phone?: string }) {
        return this.http.post(`${environment.apiUrl}auth/resendOtp`, data);
    }
    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    // register(email: string, password: string) {
    //     return getFirebaseBackend().registerUser(email, password).then((response: any) => {
    //         const user = response;
    //         return user;
    //     });
    // }

    /**
     * Reset password
     * @param email email
     */
    forgotPassword(email: string) {
        return this.http.post(`${environment.apiUrl}auth/forgotPassword`, { email });
    }

    resetPassword(body: { email: string, otp: number, newPassword: string, confirmPassword: string }) {
        return this.http.post(`${environment.apiUrl}auth/resetPassword`, body);
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        localStorage.removeItem('token');
        localStorage.removeItem('hbDashboardUser');
        // getFirebaseBackend().logout();
    }
}

