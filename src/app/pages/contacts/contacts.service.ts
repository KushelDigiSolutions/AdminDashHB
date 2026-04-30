import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "src/app/core/services/api.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ContactsService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) { }

  getUsersListing(url) {
    return this.http.get(`${environment.apiUrl}users/admin?${url}`);
  }
  getUserDetail(_id) {
    return this.http.get<{success: boolean, data: any | null}>(`${environment.apiUrl}users/detail?_id=${_id}`);
  }
  createUser(data) {
    return this.http.post(`${environment.apiUrl}users/addbyadmin`, data);
  }
  updateUserProfile(data) {
    return this.http.put(`${environment.apiUrl}users/profilebyadmin`, data);
  }
  deleteUser(id) {
    return this.http.delete(`${environment.apiUrl}users/${id}`);
  }
  /**Search Related API */
  algoliaSearch(name: string) {
    return this.http.get<{ count: number, data1: { hits: Array<any> }, success: boolean }>(`${environment.apiUrl}algoliasearch?name=${name}`);
  }

  searchConsultants(query: string, consultantType = "") {
    let params: any = {
      role: 'Consultant',
      active: true,
      activate: true,
      // limit: 50,
      userIdentifier: query,
      consultantType,
    }
    if (!query) params.limit = 20;
    return this.api.get<{ count: number, data: Array<any>, success: boolean }>('users', params);
  }

  searchUsers(query: string, queryParams = {}) {
    let params = {
      // role: 'Consultant',
      // active: true,
      // activate: true,
      limit: 50,
      userIdentifier: query,
      ...queryParams,
    }
    return this.api.get<{ count: number, data: Array<any>, success: boolean }>('users/admin', params);
  }
  //
  
  getRoles() {
    return this.http.get<string[]>(`${environment.apiUrl}users/roles`);
  }

  getUsersByRole(role: string) {
    return this.http.get<any[]>(`${environment.apiUrl}users/by-role/${role}`);
  }
}
