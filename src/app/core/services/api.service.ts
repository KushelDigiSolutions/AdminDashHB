import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

export interface RequestHttpParams { [key: string]: any }
export interface FileUploadResponse { success: boolean; data: string[] }
export interface PaginationQP { page?: number, limit?: number }
@Injectable({ providedIn: "root" })
export class ApiService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get<T>(url: string, params: RequestHttpParams = {}) {
    let httpParams = new HttpParams({ fromObject: params });
    return this.http.get<T>(this.apiUrl + url, { params: httpParams });
  }

  post<T>(url: string, body: any, params: RequestHttpParams = {}) {
    let httpParams = new HttpParams({ fromObject: params });
    return this.http.post<T>(this.apiUrl + url, body, { params: httpParams });
  }

  put<T>(url: string, body: any, params: RequestHttpParams = {}) {
    let httpParams = new HttpParams({ fromObject: params });
    return this.http.put<T>(this.apiUrl + url, body, { params: httpParams });
  }

  delete<T>(url: string) {
    return this.http.delete<T>(this.apiUrl + url);
  }
  /** File Upload API */
  fileUpload(files: File[], folder: string) {
    let fd = new FormData();
    for (let file of files) {
      fd.append("file", file);
    }
    fd.append("folder", folder);
    return this.http.post<FileUploadResponse>(
      `${environment.apiUrl}upload`,
      fd
    );
  }
}
