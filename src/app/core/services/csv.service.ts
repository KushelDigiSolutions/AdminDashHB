import { Injectable } from '@angular/core';
import saveAs from "file-saver";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(
    private toastr: ToastrService,
  ) { }


  downloadCSV(fields: any[] | string = [], filename = new Date().getTime().toString()) {
    if (typeof fields == 'string') {
      this.download(fields, filename)
    } else {
      try {
        const data = this.jsonToCsv(fields);
        this.download(data, filename);
      } catch (err: any) {
        this.toastr.error('Something went wrong!');
        console.log("ERROR: " + err.message);
      }
    }
  }

  public jsonToCsv(objArray: any[]): string {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";

    if (array.length > 0) {
      if (typeof array[0] === 'object' && array[0] !== null) {
        for (let index in array[0]) {
          row += '"' + index.replace(/"/g, '""') + '",';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
      }
    }

    for (let i = 0; i < array.length; i++) {
        let line = '';
        if (typeof array[i] === 'object' && array[i] !== null) {
          for (let index in array[i]) {
              if (line != '') line += ',';
              if (array[i][index] !== null && array[i][index] !== undefined) {
                 const value = String(array[i][index]);
                 line += `"${value.replace(/"/g, '""')}"`;
              } else {
                  line += '""';
              }
          }
        } else {
           line = `"${String(array[i]).replace(/"/g, '""')}"`;
        }
        str += line + '\r\n';
    }
    return str;
  }

  private download(data: string, filename: string) {
    let blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `HB-${filename}.csv`);
    this.toastr.success('File exported successfully')
  }
}
