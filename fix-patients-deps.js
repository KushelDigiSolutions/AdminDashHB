const fs = require('fs');
const path = require('path');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.ts')) {
            let txt = fs.readFileSync(fullPath, 'utf8');
            let m = false;

            if (txt.includes('import { CalendarOptions, EventClickArg, EventApi, FullCalendarComponent } from \'@fullcalendar/core\';')) {
                txt = txt.replace(
                    "import { CalendarOptions, EventClickArg, EventApi, FullCalendarComponent } from '@fullcalendar/core';",
                    "import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';\nimport { FullCalendarComponent } from '@fullcalendar/angular';"
                );
                m = true;
            }
            if (txt.includes('FullCalendarComponent') && txt.includes('@fullcalendar/core')) {
                txt = txt.replace(/FullCalendarComponent/g, '');
                txt = txt.replace(/,\s*\}/g, ' }');
                txt = "import { FullCalendarComponent } from '@fullcalendar/angular';\n" + txt;
                m = true;
            }

            if (txt.includes('SwiperModule')) {
                txt = txt.replace(/SwiperModule,/g, '');
                txt = txt.replace(/SwiperModule/g, '');
                m = true;
            }
            if (txt.includes('ChartsModule')) {
                txt = txt.replace(/ChartsModule,/g, '');
                txt = txt.replace(/ChartsModule/g, '');
                m = true;
            }
            if (txt.includes('NgxChartistModule')) {
                txt = txt.replace(/NgxChartistModule,/g, '');
                txt = txt.replace(/NgxChartistModule/g, '');
                m = true;
            }
            if (txt.includes('NgxIntlTelInputModule')) {
                txt = txt.replace(/NgxIntlTelInputModule,/g, '');
                txt = txt.replace(/NgxIntlTelInputModule/g, '');
                m = true;
            }
            // TS fixes for phone
            if (txt.includes('phone.e164Number.slice(phone.dialCode.length)')) {
                 txt = txt.replace(/phone\.dialCode/g, '(phone.dialCode as string)');
                 m = true;
            }
            if (txt.includes('phone.countryCode') && fullPath.includes('create-patient.component.ts')) {
                 txt = txt.replace(/phone\.countryCode/g, '(phone.countryCode as string)');
                 m = true;
            }
            if (txt.includes('phone.number') && fullPath.includes('create-patient.component.ts')) {
                 txt = txt.replace(/phone\.number/g, '(phone.number as string)');
                 m = true;
            }
            

            if (m) fs.writeFileSync(fullPath, txt, 'utf8');
        }
    }
}
walk('./src/app');
