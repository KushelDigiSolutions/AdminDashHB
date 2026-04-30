import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  constructor(
    private http: HttpClient
  ) { }

    /** File Upload API */
    fileUpload(files: File[], folder: string) {
      let fd = new FormData();
      for (let file of files) {
        fd.append('file', file)
      }
      fd.append('folder', folder);
      return this.http.post<{ success: boolean, data: string[] }>(`${environment.apiUrl}upload`, fd);
    }  

  /**Lifestyle Category */
  getLifestyleCategoryListingAll() {
    return this.http.get(`${environment.apiUrl}categories/list?categoryType=LifeStyle`);
  }
  getLifestyleCategoryList(url) {
    return this.http.get(`${environment.apiUrl}categories?categoryType=LifeStyle&${url}`);
  }
  getLifestyleCategory(_id: string) {
    return this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}categories/detail?categoryType=LifeStyle&_id=${_id}`);
  }
  addLifestyleCategory(data) {
    return this.http.post(`${environment.apiUrl}categories`, data);
  }
  updateLifestyleCategory(data) {
    return this.http.put(`${environment.apiUrl}categories`, data);
  }
  toggleLifestyleCategoryTop(data) {
    return this.http.post(`${environment.apiUrl}categories/top`, data);
  }
  toggleLifestyleCategoryFeatured(data) {
    return this.http.post(`${environment.apiUrl}categories/featured`, data);
  }
  getParentLifestyleCategories() {
    return this.http.get(`${environment.apiUrl}categories/getparentcategory?categoryType=LifeStyle`);
  }
  removeLifestyleCategory(id) {
    return this.http.delete(`${environment.apiUrl}categories/${id}`);
  }

  /**Meta related API */
  addMeta(data){
    return this.http.post(`${environment.apiUrl}metacontents`,data);
  }
  getMetaData(){
    return this.http.get(`${environment.apiUrl}metacontents`);
  }
  getMetaDetail(id){
    return this.http.get(`${environment.apiUrl}metacontents/detail?_id=${id}`);
  }
  updateMetaDetail(data){
    return this.http.put(`${environment.apiUrl}metacontents`,data);
  }
  removeMeta(id){
    return this.http.delete(`${environment.apiUrl}metacontents/${id}`);
  }

  /**Setting related API */
  addSetting(data){
    return this.http.post(`${environment.apiUrl}settings`,data);
  }
  updateSetting(data){
    return this.http.put(`${environment.apiUrl}settings`,data);
  }
  getSettings(){
    return this.http.get(`${environment.apiUrl}settings`);
  }
  getSettingDetail(id){
    return this.http.get(`${environment.apiUrl}settings/detail?_id=${id}`);
  }
  removeSetting(id){
    return this.http.delete(`${environment.apiUrl}settings/${id}`);
  }

  /**Type/Speciality Related API*/
  removeType(id){
    return this.http.delete(`${environment.apiUrl}types/${id}`);
  }
}
