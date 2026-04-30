import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastr: ToastrService
  ) { }

  success(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this.toastr.success(message, title, override)
  }

  error(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    if (!message) message = 'Something Went Wrong!';
    this.toastr.error(message, title, override)
  }
}
