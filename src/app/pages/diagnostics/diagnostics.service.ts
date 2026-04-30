import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticsService {

  constructor(
    private api: ApiService,
  ) { }

  searchProducts(params?: { keyword?: string, page?: number, limit?: number, type?: string[] }) {
    return this.api.get<{ data: any[], message: string, success: boolean, total: number }>('thyrocare/searchProducts', params)
  }

  getProductDetails(id) {
    return this.api.get<{ data: any, success: boolean }>('campCollection/test-product/' + id)
  }

  createCampCollection(data) {
    return this.api.post<{ success: boolean }>('campCollection', data)
  }

  updateCampCollection(id, data) {
    return this.api.put<{ success: boolean }>('campCollection/' + id, data)
  }

  getCampCollectionList(params?: { page?: number, limit?: number, corporatePackageId?: string }) {
    return this.api.get<{ data: any[], message: string, success: boolean, total: number }>('campCollection', params)
  }

  getCampCollection(id: string) {
    return this.api.get<{ data: any, message: string, success: boolean, total: number }>('campCollection/' + id)
  }

  deleteCampCollection(id) {
    return this.api.delete<{ success: boolean, message: string }>('campCollection/' + id)
  }

  createCorporateDiagnosticPackage(data) {
    return this.api.post<{ success: boolean }>('diagnostic-package', data)
  }

  updateCorporateDiagnosticPackage(id, data) {
    return this.api.put<{ success: boolean }>('diagnostic-package/' + id, data)
  }

  getCorporateDiagnosticPackages(params?: { page?: number, limit?: number, corporatePackageId?: string }) {
    return this.api.get<{ success: boolean, data: any, total: number }>('diagnostic-package', params)
  }

  getCorporateDiagnosticPackage(id: string) {
    return this.api.get<{ success: boolean, data: any, total: number }>('diagnostic-package/' + id)
  }

  deleteCorporateDiagnosticPackage(id: string) {
    return this.api.delete<{ success: boolean }>('diagnostic-package/' + id)
  }

  getDiagnosticBookings(params?: { page?: number, limit?: number, campId?: number, type?: 'home' | 'camp' }) {
    return this.api.get<{ success: boolean, data: any[], total: number }>('campCollection/booking/list', params)
  }

  getDiagnosticBooking(id: string) {
    return this.api.get<{ success: boolean, data: any, total: number }>('campCollection/booking/' + id)
  }

  updateProduct(id: string, body: any) {
    return this.api.put<{ success: boolean, message: string }>('campCollection/test-product/' + id, body)
  }

  deleteBooking(id) {
    return this.api.delete<{ success: boolean, message: string }>('campCollection/booking/' + id)
  }

  checkPincodeAvailability(pincode: string) {
    return this.api.post<{ success: boolean, data: any }>('thyrocare/pincodeAvailability', { pincode })
  }

  getSlotes(data: { Pincode: string, Date: string }) {
    return this.api.post<{ success: boolean, data: any }>('thyrocare/getAppointment', data)
  }

  updateBooking(id: string, data: any) {
    return this.api.put<{ success: boolean, data: any }>('campCollection/update-booking/' + id, data)
  }


}
