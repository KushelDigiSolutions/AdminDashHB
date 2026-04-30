import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService, RequestHttpParams } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) { }

  /**Doctor related Api */
  addDoctor(data){
    return this.http.post(`${environment.apiUrl}users/addbyadmin`,data);
  }
  getDoctorList(url){
    return this.http.get(`${environment.apiUrl}users/admin?role=Consultant&${url}&activate=true`);
  }
  getDoctorListAll(){
    return this.http.get(`${environment.apiUrl}users/consultant`);
  }
  getPendingDoctorList(url){
    return this.http.get(`${environment.apiUrl}users/admin?role=Consultant&${url}&activate=false`);
  }
  updateDoctor(data){
    return this.http.put(`${environment.apiUrl}users/profilebyadmin`,data);
  }
  getDoctorDetail(id){
    return this.http.get(`${environment.apiUrl}users/detail?_id=${id}`);
  }
  toggleUserAccount(data){
    return this.http.post(`${environment.apiUrl}users/deactivate`,data);
  }
  getDoctorAppointments(url,id){
    return this.http.get(`${environment.apiUrl}appointments/ofconsultant?consultantId=${id}&${url}`)
  }
  getDoctorReviews(id){
    return this.http.get(`${environment.apiUrl}reviews?user=${id}`);
  }
  verifyAndPublishReview(data){
    return this.http.post(`${environment.apiUrl}reviews/verify`,data);
  }
  removeConsultant(id){
    return this.http.delete(`${environment.apiUrl}users/${id}`);
  }

  /**Payout Realted API */
  getPayoutsList(){
    return this.http.get(`${environment.apiUrl}payouts`);
  }
  getPayoutDetail(id){
    return this.http.get(`${environment.apiUrl}payouts/detail?_id=${id}`);
  }
  addPayout(data){
    return this.http.post(`${environment.apiUrl}payouts`,data);
  }
  updatePayout(data){
    return this.http.put(`${environment.apiUrl}payouts`,data);
  }
  getEarningList(params?: RequestHttpParams){
    return this.api.get('payouts/earninglist', params);
  }

  /**Specialization Related API */
  getSpecializationList(url){
    return this.http.get(`${environment.apiUrl}healthSpecialization?${url}`);
  }
  getSpecializationListAll(){
    return this.http.get(`${environment.apiUrl}healthSpecialization/list`);
  }
  getSpecializationDetail(id){
    return this.http.get(`${environment.apiUrl}healthSpecialization/${id}`);
  }
  addSpecialization(data){
    return this.http.post(`${environment.apiUrl}healthSpecialization`, data);
  }
  updateSpecialization(data){
    return this.http.put(`${environment.apiUrl}healthSpecialization/${data._id}`, data);
  }
  deleteSpecialization(id){
    return this.http.delete(`${environment.apiUrl}healthSpecialization/${id}`);
  }
}
