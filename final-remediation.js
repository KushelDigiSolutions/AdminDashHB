const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/HP/kush/backup/HB/hb-admin-new';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const ecommerceDir = path.join(projectRoot, 'src/app/pages/ecommerce');
const files = getAllFiles(ecommerceDir).filter(f => f.endsWith('.component.ts'));

function getRel(from, to) {
    const fromDir = path.dirname(from);
    const toPath = path.resolve(projectRoot, to);
    let rel = path.relative(fromDir, toPath).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel.replace(/\.ts$/, '');
}

const symbols = {
    'EcommerceService': './src/app/pages/ecommerce/ecommerce.service.ts',
    'ToastrService': 'ngx-toastr',
    'ToastService': './src/app/core/services/toast.service.ts',
    'environment': './src/environments/environment.ts',
    'AuthenticationService': './src/app/core/services/auth.service.ts',
    'LifestyleService': './src/app/pages/lifestyle/lifestyle.service.ts',
    'TransactionService': './src/app/pages/ecommerce/orders/transaction.service.ts',
    'Transaction': './src/app/pages/ecommerce/orders/transaction.ts',
    'IBreadcrumbItems': './src/app/shared/ui/pagetitle/pagetitle.component.ts',
    'NgbdSortableHeader': './src/app/pages/ecommerce/sortable-directive.ts',
    'SortEvent': './src/app/pages/ecommerce/sortable-directive.ts',
    'User': './src/app/core/models/auth.models.ts',
    'RequestHttpParams': './src/app/core/services/api.service.ts',
    'FileUploadService': './src/app/core/services/file-upload.service.ts',
    'FileUploadResponse': './src/app/core/services/file-upload.service.ts',
    'Shops': './src/app/pages/ecommerce/shops/shops.model.ts',
    'productList': './src/app/pages/ecommerce/product.model.ts',
    'productModel': './src/app/pages/ecommerce/product.model.ts',
    'AddVariationComponent': './src/app/pages/ecommerce/modals/add-variation/add-variation.component.ts',
    'AddAttributeComponent': './src/app/pages/ecommerce/modals/add-attribute/add-attribute.component.ts',
    'AddAttributeToSetComponent': './src/app/pages/ecommerce/modals/add-attribute-to-set/add-attribute-to-set.component.ts',
    'AddTypesComponent': './src/app/pages/ecommerce/modals/add-types/add-types.component.ts',
    'RemoveModalComponent': './src/app/pages/ecommerce/modals/remove/remove-modal/remove-modal.component.ts',
    'RefundModalComponent': './src/app/pages/ecommerce/modals/refund/refund-modal/refund-modal.component.ts',
    'NewDateComponent': './src/app/pages/ecommerce/modals/new-date/new-date.component.ts',
    'SeasonSpecialComponent': './src/app/pages/ecommerce/modals/season-special/season-special.component.ts',
    'getFormatedDate': './src/app/util/date.util.ts',
    'PdfService': './src/app/core/services/pdf.service.ts',
    'CsvService': './src/app/core/services/csv.service.ts',
    'SheetsService': './src/app/core/services/sheets.service.ts',
    'shopsData': './src/app/pages/ecommerce/shops/data.ts',
    'trimInputValue': './src/app/util/input.util.ts',
    'CustomerService': './src/app/pages/ecommerce/customers/customer.service.ts',
    'Customer': './src/app/pages/ecommerce/customers/customers.model.ts',
    'saveAs': 'file-saver',
    'ToWords': 'to-words'
};

files.forEach(f => {
    let txt = fs.readFileSync(f, 'utf8');
    const className = f.split(path.sep).pop().replace('.component.ts', '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Component';
    const bodyStart = txt.indexOf('export class');
    if (bodyStart === -1) return;
    const body = txt.substring(bodyStart);
    
    let neededByModule = {};
    Object.keys(symbols).forEach(sym => {
        const regex = new RegExp('\\b' + sym + '\\b|' + sym + '<');
        if (regex.test(body) || (sym === 'shopsData' && f.includes('shops.component.ts'))) {
            const mod = symbols[sym];
            if (sym === className) return;
            const target = mod.startsWith('.') ? getRel(f, mod) : mod;
            if (!neededByModule[target]) neededByModule[target] = new Set();
            neededByModule[target].add(sym);
        }
    });

    let reachedMain = false;
    let otherLines = txt.split('\n').filter(line => {
        if (line.includes('export class') || line.includes('@Component')) reachedMain = true;
        if (reachedMain) return true;
        return !(line.trim().startsWith('import ') || line.trim().includes('FILTER_PAG_REGEX ='));
    });

    let header = [];
    header.push("import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';");
    header.push("import { FormsModule, ReactiveFormsModule, FormBuilder, NgModel, NgForm, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';");
    header.push("import { TranslateModule } from '@ngx-translate/core';");
    header.push("import { RouterModule, Router, ActivatedRoute } from '@angular/router';");
    
    let ngb = ['NgbDropdownModule', 'NgbNavModule', 'NgbPaginationModule', 'NgbTooltipModule', 'NgbHighlight', 'NgbAccordionModule', 'NgbTypeaheadModule', 'NgbCollapseModule', 'NgbDatepickerModule', 'NgbModalModule', 'NgbModal', 'NgbActiveModal', 'NgbDate', 'NgbDateStruct', 'NgbCalendar'];
    header.push(`import { ${ngb.join(', ')} } from '@ng-bootstrap/ng-bootstrap';`);
    
    header.push("import { NgSelectModule } from '@ng-select/ng-select';");
    header.push("import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';");
    header.push("import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';");
    header.push("import { HttpErrorResponse } from '@angular/common/http';");
    header.push("import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';");
    
    let cr = ['NO_ERRORS_SCHEMA', 'CUSTOM_ELEMENTS_SCHEMA', 'Component', 'OnInit', 'OnDestroy', 'ViewChild', 'ViewChildren', 'QueryList', 'Input', 'Output', 'EventEmitter', 'ViewEncapsulation', 'AfterViewInit', 'ElementRef'];
    header.push(`import { ${cr.join(', ')} } from '@angular/core';`);
    
    let pb = ['DomSanitizer', 'SafeResourceUrl', 'SafeHtml'];
    header.push(`import { ${pb.join(', ')} } from '@angular/platform-browser';`);

    header.push(`import { UIModule } from '${getRel(f, './src/app/shared/ui/ui.module.ts')}';`);

    Object.keys(neededByModule).forEach(mod => {
        if (!['@angular/common', '@angular/forms', '@ngx-translate/core', '@angular/router', '@ng-bootstrap/ng-bootstrap', 'ngx-spinner', '@angular/core', '@angular/platform-browser'].includes(mod)) {
            const syms = Array.from(neededByModule[mod]).join(', ');
            header.push(`import { ${syms} } from '${mod}';`);
        }
    });
    
    if (body.match(/\b(Observable|Subscription|Subject|of|forkJoin|debounceTime|distinctUntilChanged|map)\b/)) {
        let core = [];
        if (body.includes('Observable')) core.push('Observable');
        if (body.includes('Subscription')) core.push('Subscription');
        if (body.includes('Subject')) core.push('Subject');
        if (body.match(/\bof\(/)) core.push('of');
        if (body.match(/\bforkJoin/)) core.push('forkJoin');
        if (core.length) header.push(`import { ${core.join(', ')} } from 'rxjs';`);
        
        let ops = [];
        if (body.includes('debounceTime')) ops.push('debounceTime');
        if (body.includes('distinctUntilChanged')) ops.push('distinctUntilChanged');
        if (body.match(/\bmap\(/)) ops.push('map');
        if (ops.length) header.push(`import { ${ops.join(', ')} } from 'rxjs/operators';`);
    }

    if (body.includes('ClassicEditor')) header.push("import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';");
    if (body.includes('bsCustomFileInput')) header.push("declare var bsCustomFileInput: any;");
    if (body.includes('converter')) header.push("import * as converter from 'json-2-csv';");
    if (body.includes('FILTER_PAG_REGEX')) header.push("const FILTER_PAG_REGEX = /[^0-9]/g;");
    if (body.includes('html2pdf')) header.push("import * as html2pdf from 'html2pdf.js';");

    let finalCode = header.join('\n') + '\n' + otherLines.join('\n');
    const universalImportsList = `
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
    NgbModalModule
`;

    finalCode = finalCode.replace(/@Component\(\{[\s\S]*?selector:/, (match) => {
        return '@Component({\n  standalone: true,\n  imports: [' + universalImportsList + '\n  ],\n  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],\n  selector:';
    });

    finalCode = finalCode.replace(/return\s+(this\.(?:toastr|toaster|toast)\.(?:error|success|info|warning)\([^)]+\));/g, '$1;');
    
    if (f.includes('shops.component.ts')) {
        finalCode = finalCode.replace(/\s+shopsData = shopsData/g, ' this.shopsData = shopsData');
    }
    
    // Add-Coupons strict mode bypass
    if (f.includes('add-coupons.component.ts')) {
       finalCode = finalCode.replace(/(\n\s+)(const|let)\s+value\s+=\s+this\.form\.value;/g, '$1$2 value: any = this.form.value;');
    }

    finalCode = finalCode.replace(/: NgbModalRef/g, ': any').replace(/as NgbModalRef/g, 'as any');

    if (finalCode.includes(`import { ${className} }`)) {
        finalCode = finalCode.replace(new RegExp(`import \\{ [^}]*${className}[^}]* \\} from '[^']*';`, 'g'), '');
    }

    fs.writeFileSync(f, finalCode, 'utf8');
});
console.log('DEFINITIVE FIX v2 APPLIED');
