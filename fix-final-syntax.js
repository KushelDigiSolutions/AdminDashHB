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

            // Fix empty ViewChild types
            if (txt.includes('calendarComponent: ;')) {
                txt = txt.replace(/calendarComponent:\s*;/g, 'calendarComponent: any;');
                m = true;
            }
            if (txt.includes('eventModal: ;')) {
                txt = txt.replace(/eventModal:\s*;/g, 'eventModal: any;');
                m = true;
            }
            if (txt.includes('calendarComponent:\n')) {
                 txt = txt.replace(/calendarComponent:\s*\n\s*\n\s*breadCrumbItems/g, 'calendarComponent: any;\n\nbreadCrumbItems');
                 m = true;
            }

            // Fix FullCalendar imports to be V6 compatible
            if (txt.includes('@fullcalendar/angular') || txt.includes('@fullcalendar/core')) {
                // If it has both, we need to unify
                if (txt.includes('CalendarOptions') && !txt.includes("import { CalendarOptions")) {
                    // Skip if already correct
                } else {
                     // Basic V6 import fix
                     txt = txt.replace(/import\s+\{\s*CalendarOptions\s*,\s*EventClickArg\s*,\s*EventApi\s*,\s*\}\s*from\s*['"]@fullcalendar\/core['"];/g, 
                                       "import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';");
                }
            }

            if (m) fs.writeFileSync(fullPath, txt, 'utf8');
        }
    }
}
walk('./src/app');
