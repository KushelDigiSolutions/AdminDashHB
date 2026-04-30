import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgxDropzoneComponent } from 'ngx-dropzone';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

export interface FileUploadResponse { success: boolean; data: string[] }

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private api: ApiService,
  ) { }

  onChangeFile(event, input: AbstractControl, multiple = true) {
    input.markAsTouched();

    if (event && event?.source instanceof NgxDropzoneComponent) {
      let { addedFiles } = event;
      if (addedFiles.length)
        input.setValue(multiple ? [...input.value, ...addedFiles] : [addedFiles[0]]);
    } else {
      alert('file-upload.service.ts implemented else block')
    }
  }

  fileUpload(files: File[], folder?: string) {
    let fd = new FormData();
    for (let file of files) {
      fd.append("file", file);
    }
    if (folder) {
      fd.append("folder", folder);
    }
    return this.api.post('upload', fd) as Observable<FileUploadResponse>;


  }

  smartFileUpload(files: Array<File | string | { _id: string }>, folder?: string): Observable<FileUploadResponse> {
    let fd = new FormData();
    let typeFile = (files as any).filter(el => el instanceof File);
    let typeString = (files as any).map(el => {
      let image = el;
      if (!(el instanceof File)) {
        if (typeof el == 'object') {
          image = el._id;
        }
      }
      return image;
    }).filter(el => !(el instanceof File));

    let reqArry: Observable<FileUploadResponse>[] = [];
    reqArry.push(of<FileUploadResponse>({ success: true, data: typeString }))

    if (typeFile.length) {
      for (let file of typeFile) {
        fd.append("file", file);
      }
      if (folder) {
        fd.append("folder", folder);
      }
      reqArry.push(this.api.post('upload', fd) as Observable<FileUploadResponse>)
    }

    return forkJoin(reqArry).pipe(map(res => {
      let response: FileUploadResponse = { success: true, data: [] }
      response.data = res.reduce((accu, el) => {
        accu = [...accu, ...el.data]
        return accu;
      }, [])
      return response;
    })) as any;
  }

  instanceOfFile(f: any): boolean {
    return f instanceof File;
  }
}
