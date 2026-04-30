import { Injectable } from '@angular/core';
import { createTimeSlots, time24to12 } from 'src/app/util/date.util';
import { ApiService, PaginationQP, RequestHttpParams } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  types = [
    { label: 'Reminder (Healthpackage)', value: 'healthPackage_standard' },
    { label: 'Survey (Healthpackage)', value: 'healthPackage_survey' },
  ]
  personalizedTypes = [
    { label: 'Reminder (Daily Personalized)', value: 'hp_personalized_standard', originalType: 'healthPackage_standard' },
    { label: 'Survey (Daily Personalized)', value: 'hp_personalized_survey', originalType: 'healthPackage_survey' },
  ]

  constructor(
    private api: ApiService,
  ) { }

  createNotificationTemplate(data) {
    return this.api.post('notification-template', data);
  }

  updateNotificationTemplate(id: string, data) {
    return this.api.put('notification-template/' + id, data);
  }

  deleteNotificationTemplate(id: string) {
    return this.api.delete('notification-template/' + id);
  }

  createNotification(data) {
    return this.api.post('notification', data);
  }

  updateNotification(id: string, data: any) {
    return this.api.put('notification/' + id, data);
  }

  deleteNotification(id: string) {
    return this.api.delete('notification/' + id);
  }

  getNotificationTemplates(params?: RequestHttpParams) {
    return this.api.get<{ success: boolean, data: any[], total: number }>('notification-template', params);
  }

  getNotificationTemplate(id: string) {
    return this.api.get<{ success: boolean, data: any }>('notification-template/' + id);
  }

  getNotifications(queryParams: PaginationQP & { notificationType?: string[], emptyHealthPackage?: boolean }) {
    return this.api.get<{ success: boolean, data: any[], total: number }>('notification', queryParams);
  }

  getNotification(id: string) {
    return this.api.get<{ success: boolean, data: any }>('notification/' + id);
  }

  getTimeSlots() {
    return createTimeSlots(60, '5:00', '22:30').map(el => ({ value: el, label: time24to12(el) }))
  }
}
