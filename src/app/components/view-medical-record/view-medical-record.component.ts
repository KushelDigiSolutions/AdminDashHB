import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-view-medical-record',
  templateUrl: './view-medical-record.component.html',
  styleUrls: ['./view-medical-record.component.scss']
})
export class ViewMedicalRecordComponent implements OnInit {

  @ViewChild("medicalAttachmentModal") medicalAttachmentModal: ElementRef;

  imageUrl = environment.imageUrl
  currentOpenedAttachment: any = "";
  currentOpenedAttachmentType: any = "";
  showImageBlock = true;
  openModalRef: NgbModalRef;

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    
  }

  viewRecord(filepath) {
    this.currentOpenedAttachment = filepath;

    let fileType: any;
    fileType = this.currentOpenedAttachment.split(".");
    this.currentOpenedAttachmentType = fileType[1];
    if (
      this.currentOpenedAttachmentType == "pdf" ||
      this.currentOpenedAttachmentType == "PDF" ||
      this.currentOpenedAttachmentType == "Pdf"
    ) {
      this.showImageBlock = false;
      this.currentOpenedAttachment =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          this.imageUrl + this.currentOpenedAttachment + '#toolbar=0'
        );
    } else {
      this.showImageBlock = true;
    }
    this.openModalRef = this.modalService.open(this.medicalAttachmentModal, {
      size: "xl",
      windowClass: "modal-holder",
      centered: true,
    });
    window.scroll(0, 0);
  }

}
