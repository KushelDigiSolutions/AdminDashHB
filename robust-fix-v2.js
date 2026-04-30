const fs = require('fs');

const files = [
    './src/app/pages/ecommerce/products/products.component.ts',
    './src/app/pages/ecommerce/products/variations/variations.component.ts',
    './src/app/pages/ecommerce/seasons/seasons.component.ts',
    './src/app/pages/ecommerce/seasons/add-season/add-season.component.ts',
    './src/app/pages/ecommerce/shops/shops.component.ts',
    './src/app/pages/ecommerce/products/taxes/taxes.component.ts',
    './src/app/pages/ecommerce/promotional-banner/promotional-banner.component.ts',
    './src/app/pages/ecommerce/promotional-banner/add-promotional-banner/add-promotional-banner.component.ts'
];

const header = `import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
`;

const universalImports = `
    CommonModule,
    AsyncPipe,
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbHighlight,
    NgbAccordionModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    UIModule,
    NgSelectModule,
    NgOptionHighlightDirective,
    DropzoneModule
`;

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let txt = fs.readFileSync(f, 'utf8');
    
    // Calculate UIModule path
    const parts = f.split('/');
    const appIndex = parts.indexOf('app');
    const dotdots = parts.length - appIndex - 2;
    const uiPath = '../'.repeat(dotdots) + 'shared/ui/ui.module';
    const uiImport = `import { UIModule } from '${uiPath}';\n`;
    
    // Clean up old faulty conversion attempts
    txt = txt.replace(/import { CommonModule }[^;]+;/g, '');
    txt = txt.replace(/import { FormsModule[^;]+;/g, '');
    txt = txt.replace(/import { TranslateModule[^;]+;/g, '');
    txt = txt.replace(/import { UIModule }[^;]+;/g, '');
    txt = txt.replace(/import { NgOptionHighlightDirective }[^;]+;/g, '');
    txt = txt.replace(/import { NgOptionHighlightModule }[^;]+;/g, '');
    
    // Prepend header
    txt = header + uiImport + txt;
    
    // Force standalone: true
    txt = txt.replace(/standalone: (false|true)/, 'standalone: true');
    if (!txt.includes('standalone: true')) {
        txt = txt.replace('@Component({', '@Component({\n  standalone: true,');
    }
    
    // Replace imports array with universal one
    txt = txt.replace(/imports: \[[\s\S]*?\]/, `imports: [${universalImports}\n  ]`);
    if (!txt.includes('imports: [')) {
        txt = txt.replace('standalone: true,', `standalone: true,\n  imports: [${universalImports}\n  ],`);
    }
    
    fs.writeFileSync(f, txt, 'utf8');
    console.log('Fixed Standalone for ' + f);
});
