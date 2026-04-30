import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, RequestHttpParams } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultantApiService {

  constructor(
    private api: ApiService
  ) { }

  getProfile() {
    return this.api.get('users/profile');
  }

  updateProfile(body) {
    return this.api.put('users', body);
  }

  updateProfileByAdmin(body) {
    return this.api.put('users/profilebyadmin', body);
  }

  uploadFile(file: File, folder?: string) {
    let fd = new FormData();
    fd.append('file', file);
    if (folder) fd.append('folder', folder);

    return <Observable<{ success: boolean, data: string[] }>>this.api.post('upload', fd);
  }

  updateSlotAvailability(data: { timeSlotId: string, slotTimeId: string, isActive: boolean }) {
    return <Observable<{ success: boolean, message: string }>>this.api.post('users/updateslot', data);
  }

  addUnavailableslot(data: { date: string, slot: string }) {
    return <Observable<{ success: boolean, message: string }>>this.api.post('users/unavailableslot', data);
  }

  removeUnavailableslot(data: { date: string, slot: string }) {
    return <Observable<{ success: boolean, message: string }>>this.api.post('users/removeunavailableslot', data);
  }

  getAppointments(consultantId: string) {
    return <Observable<{ success: boolean, data: { appointments: any[], noOfAppointments: number } }>>this.api.get('appointments/ofconsultant', { consultantId });
  }

  getSlots(consultantId: string, startDate: string, canBeBooked: boolean = false) {
    return this.api.get('users/timeslots', { consultantId, startDate, canBeBooked });
  }

  getUnavailableSlots(consultantId) {
    return this.api.get('users/unavailableslot', { consultantId });
  }

  createPatient(body) {
    return this.api.post('corporate/patients', body)
  }

  getUserAppointments(userId: string, params?: RequestHttpParams) {
    return this.api.get<{ success: boolean, data: any, total: number }>('users/' + userId + '/appointment', params)
  }

  getUserPrescriptions(userId: string, params?: RequestHttpParams) {
    return this.api.get<{ success: boolean, data: any, total: number }>('users/' + userId + '/prescription', params)
  }
  getUserMedicalrecord(userId: string, params?: RequestHttpParams) {
    return this.api.get<{ success: boolean, data: any, count: number }>('users/' + userId + '/medicalrecord', params)
  }
  getUserConsultationPayments(userId: string, params?: RequestHttpParams) {
    return this.api.get<{ success: boolean, data: any, total: number }>('users/' + userId + '/payments', params)
  }
  getUserVitals(params: { userId: string, startDate?: string, endDate?: string }) {
    return this.api.get<{ success: boolean, data: any }>('stats/vitalsForConsultant', params)
  }
  getUserSymptoms(params: { userId: string, startDate?: string, endDate?: string }) {
    return this.api.get<{ success: boolean, data: any }>('stats/symptomsForConsultant', params)
  }
  getPatientsList(params?) {
    return this.api.get<{ success: boolean, data: any[], total: number }>('corporate/patients', params)
  }

  createAppointmentForPatient(data){
    return this.api.post('appointments/forPatients', data)
  }

  updateAppointmentForPatient(data){
    return this.api.put('appointments/forPatients', data)
  }
}
