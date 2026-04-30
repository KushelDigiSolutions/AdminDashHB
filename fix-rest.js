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

            // Remove NgOptionHighlightModule
            if (txt.includes('NgOptionHighlightModule')) {
                txt = txt.replace(/import\s+\{([^}]*?)NgOptionHighlightModule([^}]*?)\}\s+from\s+['"]@ng-select\/ng-option-highlight['"];/g, '');
                txt = txt.replace(/NgOptionHighlightModule,/g, '');
                txt = txt.replace(/NgOptionHighlightModule/g, '');
                m = true;
            }

            // Fix Fullcalendar imports
            if (txt.includes('@fullcalendar/angular')) {
                txt = txt.replace(/import\s+\{\s*CalendarOptions([^{}]*)\}\s+from\s+['"]@fullcalendar\/angular['"];/g, 
                    "import { CalendarOptions $1 } from '@fullcalendar/core';\nimport { FullCalendarModule } from '@fullcalendar/angular';");
                
                txt = txt.replace(/import\s+\{\s*EventInput([^{}]*)\}\s+from\s+['"]@fullcalendar\/angular['"];/g, 
                    "import { EventInput $1 } from '@fullcalendar/core';");
                    
                // Custom targeted replace for consultant-appointments.component.ts if it is multi-line
                txt = txt.replace(/import\s+\{\s*CalendarOptions,\s*EventClickArg,\s*EventApi,?\s*\}\s*from\s*['"]@fullcalendar\/angular['"];/g, 
                    "import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';");
                m = true;
            }

            if (m) fs.writeFileSync(fullPath, txt, 'utf8');
        }
    }
}
walk('./src/app');

