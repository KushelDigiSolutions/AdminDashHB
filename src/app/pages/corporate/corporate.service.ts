import { Injectable } from '@angular/core';
import { ApiService, RequestHttpParams } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CorporateService {

  constructor(
    private api: ApiService,
  ) { }

  createCompany(data) {
    return this.api.post('company', data)
  }

  updateCompany(id: string, data) {
    return this.api.put('company/' + id, data)
  }

  deleteCompany(id) {
    return this.api.delete('company/' + id)
  }

  getCompanyList(params?: RequestHttpParams) {
    return this.api.get('company', params)
  }

  getCompany(id: string) {
    return this.api.get('company/' + id)
  }
  // 
  createWebinar(data) {
    return this.api.post('webinar', data)
  }

  updateWebinar(id: string, data) {
    return this.api.put('webinar/' + id, data)
  }

  deleteWebinar(id) {
    return this.api.delete('webinar/' + id)
  }

  getWebinarList(params?: RequestHttpParams) {
    return this.api.get('webinar', params)
  }

  getWebinar(id: string) {
    return this.api.get('webinar/' + id)
  }
  // 
  createCorporateWebinar(data) {
    return this.api.post('corporatewebinar', data)
  }

  updateCorporateWebinar(id: string, data) {
    return this.api.put('corporatewebinar/' + id, data)
  }

  deleteCorporateWebinar(id) {
    return this.api.delete<{ success: boolean }>('corporatewebinar/' + id)
  }

  getCorporateWebinarList(params?: RequestHttpParams) {
    return this.api.get('corporatewebinar', params)
  }

  getCorporateWebinar(id: string) {
    return this.api.get('corporatewebinar/' + id)
  }

  // 
  createCorporatePackage(data) {
    return this.api.post('corporatepackage', data)
  }

  updateCorporatePackage(id: string, data) {
    return this.api.put('corporatepackage/' + id, data)
  }

  deleteCorporatePackage(id) {
    return this.api.delete('corporatepackage/' + id)
  }

  getCorporatePackagesList(params?: RequestHttpParams) {
    return this.api.get('corporatepackage', params)
  }

  getCorporatePackage(id: string) {
    return this.api.get('corporatepackage/' + id)
  }
  // 
  addLifestyleTip(data) {
    return this.api.post('corporatelifestyle', data)
  }

  updateLifestyleTip(id: string, data) {
    return this.api.put('corporatelifestyle/' + id, data)
  }

  deleteLifestyleTip(id) {
    return this.api.delete<{ success: boolean }>('corporatelifestyle/' + id)
  }

  getLifestyleTipsList(params?: RequestHttpParams) {
    return this.api.get('corporatelifestyle/admin', params)
  }

  getLifestyleTip(id: string) {
    return this.api.get('corporatelifestyle/' + id)
  }
  // 
  createEmail(data) {
    return this.api.post('corporate/email', data)
  }

  updateEmail(id: string, data) {
    return this.api.put('corporate/email' + id, data)
  }

  deleteEmail(id) {
    return this.api.delete<{ success: boolean }>('corporate/email/' + id)
  }

  getEmailsList(params?: RequestHttpParams) {
    return this.api.get('corporate/admin/emailer', params)
  }

  getEmail(id: string) {
    return this.api.get('corporate/emailer' + id)
  }
}
