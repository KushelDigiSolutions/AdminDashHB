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

const headerTemplate = (uiPath) => `import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { UIModule } from '${uiPath}';
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
    
    // 1. Strip ALL existing imports of these libraries to resolve duplicates
    const libraries = [
        '@angular/common', '@angular/forms', '@ngx-translate/core', '@angular/router', 
        '@ng-bootstrap/ng-bootstrap', '@ng-select/ng-select', '@ng-select/ng-option-highlight', 
        'src/app/components/dropzone/dropzone.module', 'shared/ui/ui.module'
    ];
    
    let lines = txt.split('\n');
    lines = lines.filter(line => {
        return !libraries.some(lib => line.includes(lib));
    });
    txt = lines.join('\n');
    
    // 2. Prepend the clean header
    const parts = f.split('/');
    const appIndex = parts.indexOf('app');
    const dotdots = parts.length - appIndex - 2;
    const uiPath = '../'.repeat(dotdots) + 'shared/ui/ui.module';
    txt = headerTemplate(uiPath) + txt;
    
    // 3. Normalize Component Metadata
    txt = txt.replace(/standalone: (false|true),?/g, '');
    txt = txt.replace(/imports: \[[\s\S]*?\]/, '');
    
    txt = txt.replace('@Component({', `@Component({\n  standalone: true,\n  imports: [${universalImports}\n  ],`);
    
    // Clean up empty lines or double imports that might have slipped through
    txt = txt.replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(f, txt, 'utf8');
    console.log('Super Cleaned Standalone: ' + f);
});
