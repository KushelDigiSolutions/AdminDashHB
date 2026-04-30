import { Injectable } from '@angular/core';
import html2pdf from "html2pdf.js";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    private spinner: NgxSpinnerService,
  ) { }

  downloadPDF(htmlSelector, filename) {
    let { scrollX, scrollY } = window;
    if (scrollX != 0 || scrollY != 0) {
      window.scroll(0, 0);
    }

    this.spinner.show();
    document.body.classList.add('downloading-pdf');
    setTimeout(() => {
      let node = document.querySelector(htmlSelector);
      var opt = {
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { letterRendering: true, scale: 4, useCORS: true },
        jsPDF: { unit: "mm", format: 'letter', orientation: "portrait" },
      };

      html2pdf()
        .from(node)
        .set(opt)
        .save()
        .then(() => {
          this.spinner.hide();
          window.scroll(scrollX, scrollY);
          document.body.classList.remove('downloading-pdf');
        })
        .catch((err) => {
          this.spinner.hide();
          document.body.classList.remove('downloading-pdf');
        });
    }, scrollX != 0 || scrollY != 0 ? 500 : 10);
  }

}
