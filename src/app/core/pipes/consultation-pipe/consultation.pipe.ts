import { Pipe, PipeTransform } from '@angular/core';
import { time24to12 } from 'src/app/util/date.util';

@Pipe({
  standalone: false,
  name: 'consultation'
})
export class ConsultationPipe implements PipeTransform {

  transform(value: any, type: 'slot', ...args: unknown[]): unknown {
    let [defaultValue] = args;
    switch (type) {
      case 'slot': {
        if (!value) return '';
        return value.split('-').map(el => time24to12(el.trim())).join(' - ')
      }
      default: return value;
    }
  }

}
