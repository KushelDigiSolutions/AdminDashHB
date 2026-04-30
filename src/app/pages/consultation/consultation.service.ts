import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) { }

  /**Appointment Related API */
  getAppointmentList(url) {
    return this.http.get(`${environment.apiUrl}appointments?${url}`);
  }
  getConsultantAppointment(url) {
    return this.http.get(`${environment.apiUrl}appointments/ofconsultant?${url}`);
  }
  removeAppointment(id) {
    return this.http.delete(`${environment.apiUrl}appointments/${id}`);
  }
  getConsultationTypes() {
    return this.http.get(`${environment.apiUrl}types`);
  }
  getAppointmentDetail(id) {
    return this.http.get(`${environment.apiUrl}appointments/detail?_id=${id}`);
  }
  cancelAppointment(data) {
    return this.http.post(`${environment.apiUrl}appointments/cancel`, data);
  }
  createAppointment(data) {
    return this.http.post(`${environment.apiUrl}appointments/createbyadmin`, data);
  }
  updateAppointment(data) {
    return this.api.put('appointments/updatebyadmin', data);
  }

  getAppointmentPrescriptionList(params: { appointmentId: string, page?: number, limit?: number }) {
    return this.api.get(`prescriptions`, params);
  }

  getPrescriptionDetails(id: string) {
    return this.api.get(`prescriptions/detail`, { _id: id });
  }
}
