import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'consultant'
})
export class ConsultantPipe implements PipeTransform {

  transform(value: any, type: 'fullname' | 'desQual' | 'address' | 'consultantType' | 'speciality', ...args: unknown[]): unknown {
    let [defaultValue] = args;
    switch (type) {
      case 'fullname': {
        return ((value.firstName || '') + ' ' + (value.lastName || '')).trim() || (defaultValue || 'HB Consultant')
      }
      case 'desQual': {
        let qualification = (value.qualification || []).filter(el => el.show).map(el => el.degree).join(', ')
        return [value.designation, qualification].filter(el => el).join(' | ')
      }
      case 'consultantType': {
        return (value.consultantType || [])[0]?.name || '';
      }
      case 'speciality': {
        let str = (value.speciality || []).map(el => el.name).join(' ');
        return str ? str + ' Specialist' : '';
      }
      case 'address': {
        if (!value.currentAddress) return '';

        return [value.currentAddress.city, value.currentAddress.state]
          .filter(el => !!el)
          .map(el => {
            el = el.toLowerCase();
            el = el.split(' ').map(el => el[0].toUpperCase() + el.substr(1)).join(' ');
            return el;
          }).join(', ');
      }
      default: return value;
    }
  }

}
