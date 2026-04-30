const fs = require('fs');
const path = require('path');

const componentsToConvert = [
    {
        file: './src/app/pages/ecommerce/products/products.component.ts',
        imports: ['CommonModule', 'FormsModule', 'ReactiveFormsModule', 'TranslateModule', 'RouterModule', 'NgbDropdownModule', 'NgbNavModule', 'UIModule', 'NgSelectModule', 'NgOptionHighlightModule', 'NgbPaginationModule', 'NgbTooltipModule']
    },
    {
        file: './src/app/pages/ecommerce/products/variations/variations.component.ts',
        imports: ['CommonModule', 'FormsModule', 'TranslateModule', 'RouterModule', 'NgbPaginationModule', 'NgbHighlight', 'UIModule']
    },
    {
        file: './src/app/pages/ecommerce/seasons/seasons.component.ts',
        imports: ['CommonModule', 'FormsModule', 'TranslateModule', 'RouterModule', 'NgbPaginationModule', 'NgbHighlight', 'UIModule']
    },
    {
        file: './src/app/pages/ecommerce/seasons/add-season/add-season.component.ts',
        imports: ['CommonModule', 'FormsModule', 'TranslateModule', 'RouterModule', 'UIModule']
    },
    {
        file: './src/app/pages/ecommerce/shops/shops.component.ts',
        imports: ['CommonModule', 'FormsModule', 'TranslateModule', 'RouterModule', 'UIModule']
    },
    {
        file: './src/app/pages/ecommerce/products/taxes/taxes.component.ts',
        imports: ['CommonModule', 'FormsModule', 'ReactiveFormsModule', 'TranslateModule', 'RouterModule', 'UIModule', 'NgbPaginationModule', 'NgbHighlight']
    },
    {
        file: './src/app/pages/ecommerce/promotional-banner/promotional-banner.component.ts',
        imports: ['CommonModule', 'FormsModule', 'TranslateModule', 'RouterModule', 'UIModule', 'NgbPaginationModule', 'NgbHighlight']
    },
    {
        file: './src/app/pages/ecommerce/promotional-banner/add-promotional-banner/add-promotional-banner.component.ts',
        imports: ['CommonModule', 'FormsModule', 'ReactiveFormsModule', 'TranslateModule', 'RouterModule', 'UIModule', 'DropzoneModule']
    }
];

const baseImports = `import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from '../../../shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
`;

componentsToConvert.forEach(comp => {
    if (!fs.existsSync(comp.file)) {
        console.log(`Skipping missing file: ${comp.file}`);
        return;
    }
    let txt = fs.readFileSync(comp.file, 'utf8');
    
    // Add standalone: true if not present or replace standalone: false
    if (txt.includes('standalone: false')) {
        txt = txt.replace('standalone: false', 'standalone: true');
    } else if (!txt.includes('standalone: true')) {
        txt = txt.replace('@Component({', '@Component({\n  standalone: true,');
    }
    
    // Add imports array to component decorator
    const importsStr = `  imports: [\n    ${comp.imports.join(',\n    ')}\n  ],`;
    if (!txt.includes('imports: [')) {
        txt = txt.replace('standalone: true,', `standalone: true,\n${importsStr}`);
    }
    
    // Add necessary import statements at the top
    if (!txt.includes("@angular/common")) {
        txt = baseImports + "\n" + txt;
    }

    // Fix relative UIModule path based on depth
    const depth = comp.file.split('/').length - 1;
    let uiPath = '';
    if (depth === 5) uiPath = '../../shared/ui/ui.module'; // ecommerce/products/products.component.ts
    if (depth === 6) uiPath = '../../../shared/ui/ui.module'; // ecommerce/products/variations/variations.component.ts
    txt = txt.replace(/import { UIModule } from '[^']+';/g, `import { UIModule } from '${uiPath}';`);

    fs.writeFileSync(comp.file, txt, 'utf8');
    console.log(`Converted to Standalone: ${comp.file}`);
});
