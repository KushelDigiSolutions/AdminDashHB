const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

const ecommerceDir = './src/app/pages/ecommerce';
const files = getAllFiles(ecommerceDir).filter(f => f.endsWith('.component.ts'));

const headerTemplate = (uiPath) => `import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, NgModel, NgForm, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule, NgbModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
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
    NgbDatepickerModule,
    UIModule,
    NgSelectModule,
    NgOptionHighlightDirective,
    DropzoneModule
`;

files.forEach(f => {
    // Normalizing path for matching
    const relativePath = f.replace(/\\/g, '/');
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
    // Calculate UIModule path relative to the file
    // f like "src/app/pages/ecommerce/orders/orders.component.ts"
    const parts = relativePath.split('/');
    const appIndex = parts.indexOf('app');
    const dotdots = parts.length - appIndex - 2;
    const uiPath = '../'.repeat(dotdots) + 'shared/ui/ui.module';
    txt = headerTemplate(uiPath) + txt;
    
    // 3. Clean and normalize metadata
    // Remove standalone, imports, and extra commas in the whole decorator block
    txt = txt.replace(/@Component\(\{[\s\S]*?selector:/, (match) => {
        return '@Component({\n  standalone: true,\n  imports: [' + universalImports + '\n  ],\n  selector:';
    });

    // Cleanup double commas or bad syntax
    txt = txt.replace(/,(\s*),/g, ',');
    txt = txt.replace(/\[\s*,/g, '[');

    fs.writeFileSync(f, txt, 'utf8');
    console.log('Mass Converted: ' + relativePath);
});
