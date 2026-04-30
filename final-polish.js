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

const headerTemplate = (uiPath) => `
import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, NgModel, NgForm, FormGroup, FormControl, FormArray } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule, NgbModal, NgbDatepickerModule, NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { HttpErrorResponse } from '@angular/common/http';
import { UIModule } from '${uiPath}';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
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
    DropzoneModule,
    NgxSpinnerModule
`;

files.forEach(f => {
    const relativePath = f.replace(/\\/g, '/');
    let txt = fs.readFileSync(f, 'utf8');
    
    // 1. COMPLETELY strip all imports from the top until the @Component decorator
    // This is safer to avoid residual mangled code
    const componentIndex = txt.indexOf('@Component');
    if (componentIndex === -1) return;
    
    let restOfFile = txt.substring(componentIndex);
    
    // 2. Prepend the clean header
    const parts = relativePath.split('/');
    const appIndex = parts.indexOf('app');
    const dotdots = parts.length - appIndex - 2;
    const uiPath = '../'.repeat(dotdots) + 'shared/ui/ui.module';
    
    txt = headerTemplate(uiPath) + restOfFile;
    
    // 3. Normalize Component Metadata
    txt = txt.replace(/@Component\(\{[\s\S]*?selector:/, (match) => {
        return '@Component({\n  standalone: true,\n  imports: [' + universalImports + '\n  ],\n  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],\n  selector:';
    });
    
    // 4. Resolve Type errors
    txt = txt.replace(/NgbModalRef/g, 'any');
    txt = txt.replace(/NgbActiveModalRef/g, 'any');
    
    // 5. Fix return toastr errors
    txt = txt.replace(/return this\.toastr\.error\(([^)]+)\);/g, 'this.toastr.error($1); return;');
    txt = txt.replace(/return this\.toaster\.error\(([^)]+)\);/g, 'this.toaster.error($1); return;');

    fs.writeFileSync(f, txt, 'utf8');
    console.log('Final Polish: ' + relativePath);
});
