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
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, NgModel, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { HttpErrorResponse } from '@angular/common/http';
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
    
    // 1. Strip ALL existing common imports
    const libraries = [
        '@angular/common', '@angular/forms', '@ngx-translate/core', '@angular/router', 
        '@ng-bootstrap/ng-bootstrap', '@ng-select/ng-select', '@ng-select/ng-option-highlight', 
        'src/app/components/dropzone/dropzone.module', 'shared/ui/ui.module', '@angular/common/http'
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
    
    // 3. Clean up broken metadata (remnants of previous failed attempts)
    // Remove faulty commas and lines
    txt = txt.replace(/@Component\(\{[\s\S]*?selector:/, (match) => {
        // Just keep the @Component({
        return '@Component({\n  selector:';
    });
    
    // Re-inject the correct standalone and imports BEFORE selector
    txt = txt.replace('@Component({', `@Component({\n  standalone: true,\n  imports: [${universalImports}\n  ],`);
    
    // Final sanity check for double commas in the decorator
    txt = txt.replace(/,(\s*),/g, ',');
    txt = txt.replace(/\[\s*,/g, '[');

    fs.writeFileSync(f, txt, 'utf8');
    console.log('Final Normalized Standalone: ' + f);
});
