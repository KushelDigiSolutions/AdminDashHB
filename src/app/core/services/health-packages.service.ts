import { Injectable } from '@angular/core';
import { ApiService, RequestHttpParams } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HealthPackagesService {

  constructor(
    private api: ApiService,
  ) { }

  getSubscribedPackagesforAdmin(params?: RequestHttpParams) {
    return this.api.get<{ success: boolean, data: any[], total: number }>('healthpackagebuy/for-admin', params)
  }

  getSubscribedPackagesforConsultant(params?: RequestHttpParams) {
    return this.api.get<{ success: boolean, data: any[], total: number }>('healthpackagebuy/consultant', params)
  }

  getSubscribedPackageDetail(id: string) {
    return this.api.get<{ success: boolean, data: any }>('healthpackagebuy/detail', { _id: id })
  }

  getNotifications(id: string, fromDate: string, toDate: string) {
    return this.api.get<{ success: boolean, data: { [key: string]: any[] } }>('healthpackagebuy/user-notification-list', { healthPackageBuyId: id, fromDate, toDate })
  }

  getPersonlizedNotifications(healthPackageId: string, healthPackageBuyId: string, params: RequestHttpParams = {}) {
    return this.api.get<{ success: boolean, total: number, data: any[] }>('healthpackagebuy/consultant-notification-list', { healthPackageId, healthPackageBuyId, ...params })
  }

  deleteSubscription(subscriptionId: string) {
    return this.api.delete<{ success: boolean }>('healthpackagebuy/' + subscriptionId)
  }
}
