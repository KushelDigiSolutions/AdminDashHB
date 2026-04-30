import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  constructor() { }

  labTestDetail(slug: string) {
    return 'lab-tests/' + slug
  }
}
