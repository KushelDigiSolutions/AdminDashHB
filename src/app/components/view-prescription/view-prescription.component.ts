import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PdfService } from 'src/app/core/services/pdf.service';
import { ConsultationService } from 'src/app/pages/consultation/consultation.service';
import { getFormatedDate } from 'src/app/util/date.util';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-view-prescription',
  templateUrl: './view-prescription.component.html',
  styleUrls: ['./view-prescription.component.scss'],
})
export class ViewPrescriptionComponent implements OnInit {
  @ViewChild('prescriptionModal') prescriptionModal: ElementRef;

  imageUrl = environment.imageUrl;
  prescriptionModalData: any;
  openModalRef: NgbModalRef;

  constructor(
    private spinner: NgxSpinnerService,
    private consultationService: ConsultationService,
    private pdf: PdfService,
    private sanitizer: DomSanitizer,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  viewPrescription(prescriptionId) {
    this.spinner.show();
    this.consultationService.getPrescriptionDetails(prescriptionId).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.data) {
          let { DOB } = res.data.userId;
          if (DOB) {
            try {
              let dob = new Date(DOB);
              let current = new Date();

              res.data.userId.DOBYear = current.getFullYear() - dob.getFullYear();
              res.data.userId.DOBMonth = current.getMonth() - dob.getMonth();
            } catch (e) {}
          }
          this.prescriptionModalData = {
            data: res.data,
            prescriptionHtml: this.sanitizer.bypassSecurityTrustHtml(res.prescriptionHtml),
          };
          this.cdr.markForCheck();
        }
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.toaster.error(err.error?.message || 'Something went wrong!');
      },
    );

    this.openModalRef = this.modalService.open(this.prescriptionModal, {
      size: 'xl',
      windowClass: 'modal-holder',
      centered: true,
    });
  }

  downloadPrescription() {
    let { title, userId } = this.prescriptionModalData.data;
    let username = '';
    if (userId) {
      username = userId.firstName + ' ' + userId.lastName;
    }
    this.pdf.downloadPDF(
      '#presCont',
      `${title}-${username}-${getFormatedDate(new Date(), 'DD-MM-YYYY')}`,
    );
  }
}
