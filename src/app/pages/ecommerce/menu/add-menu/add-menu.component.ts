import { firstValueFrom } from 'rxjs';
import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgModel, NgForm, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbHighlight, NgbAccordionModule, NgbTypeaheadModule, NgbCollapseModule, NgbDatepickerModule, NgbModalModule, NgbModal, NgbActiveModal, NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DropzoneModule } from 'src/app/components/dropzone/dropzone.module';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../../shared/ui/ui.module';
import { EcommerceService } from '../../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { LifestyleService } from '../../../lifestyle/lifestyle.service';
import { IBreadcrumbItems } from '../../../../shared/ui/pagetitle/pagetitle.component';
import { trimInputValue } from '../../../../util/input.util';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    UIModule,
    NgSelectModule,
    DropzoneModule,
    NgbModalModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {

  breadCrumbItems: IBreadcrumbItems;

  form = this.fb.group({
    module: ["", Validators.required],
    name: [""],
    type: ["", Validators.required],
    list: ["",],
    url: [""],
    target: 'Same Tab',
    isLink: ['true'],
    parent: [null],
  });

  editId: string;
  links = [];
  menu = [];
  moduleType: any;
  selected_module: string;
  selected_type: string;
  selected_list: any;
  pageSize: number = 1000;
  page: number = 1;
  dataArray: any;
  total = 0;

  shopNowType = [
    { name: 'Category', value: 'Category' },
    { name: 'Brand', value: 'Brand' },
    { name: 'Health Concern', value: 'Health Concern' },
  ];

  general = [
    { name: 'Page', value: 'Page' },
    { name: 'URL', value: 'URL' },
  ];

  lifestyleType = [
    { name: 'Category', value: 'Category' },
  ];

  consultantType = [
    { name: 'Consultant Type', value: 'Consultant Type' },
  ];

  payload: any = {
    module: "",
    name: "",
    type: "",
    categoryId: null,
    url: "",
    parent: "",
    brandId: null,
    healthConcernId: null,
    target: "",
    consultantTypeId: null,
  };

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private api: EcommerceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private lifestyle: LifestyleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.editId = this.route.snapshot.params['id'];
      this.breadCrumbItems = [
        { label: 'Menu', path: '/ecommerce/menu' },
        { label: this.editId ? 'Edit' : 'Create', active: true }
      ];
      this.getList();

      this.form.get('module').valueChanges.subscribe((selectedModule) => {
        setTimeout(() => {
          this.selected_module = selectedModule;
          this.updateNameValidator(selectedModule);
          this.cdr.detectChanges();
        });
      });
      this.cdr.detectChanges();
    });
  }

  updateNameValidator(selectedModule: string): void {
    const nameControl = this.form.get('name');
    const urlControl = this.form.get('url');
    if (selectedModule === 'general') {
      nameControl.setValidators([Validators.required]);
      urlControl.setValidators([Validators.required]);
    } else {
      nameControl.clearValidators();
    }
    nameControl.updateValueAndValidity();
  }

  getList() {
    this.spinner.show();
    this.api.getMenuList().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.spinner.hide();
          let links = [];
          this.menu = JSON.parse(JSON.stringify(res.data.menus));

          res.data.menus.forEach(el => {
            let link = { ...el };
            delete link.children;
            links.push(link, ...this.getChildren(el));
          });

          links = links.map(el => {
            if (el.parent) {
              let parent = links.find(link => link._id == el.parent);
              if (parent) el.parentName = parent.name;
            }
            return el;
          });
          this.links = links;
          if (this.editId) {
            let editMenu = links.find(el => el._id == this.editId);
            if (!editMenu) {
              this.router.navigateByUrl('/ecommerce/menu');
              return;
            }
            this.patchFormValue(editMenu);
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.spinner.hide();
      }
    });
  }

  getChildren(item) {
    let children: any[] = item.children || [];
    let result = [];
    for (let child of children) {
      let childCopy = { ...child };
      delete childCopy.children;
      result.push(childCopy, ...this.getChildren(child));
    }
    return result;
  }

  get f() {
    return this.form.controls;
  }

  patchFormValue(editFormValue: any) {
    this.form.patchValue({
      module: editFormValue.module,
      name: editFormValue.name,
      type: editFormValue.type,
      list: this.checkListId(editFormValue),
      url: editFormValue.url,
      target: editFormValue.target,
      isLink: editFormValue.isLink ? 'true' : 'false',
      parent: editFormValue.parent
    });

    this.selected_module = editFormValue.module;
    this.getType({ target: { value: this.selected_module } });
    this.selected_type = editFormValue.type;
    this.getTypeBasedList({ target: { value: this.selected_type } });
  }

  checkListId(formValue) {
    let idValue: string;
    if (formValue.type === 'Category') {
      idValue = formValue.categoryId?._id || '';
    } else if (formValue.type === 'Brand') {
      idValue = formValue.brandId?._id || '';
    } else if (formValue.type === 'Health Concern') {
      idValue = formValue.healthConcernId?._id || '';
    } else if (formValue.type === 'Consultant Type') {
      idValue = formValue.consultantTypeId?._id || '';
    }
    return idValue || '';
  }

  onChangeParent(_id) {
    this.form.get('parent').setValue(_id)
  }

  trim(input) {
    trimInputValue(input)
  }

  getType(value: any) {
    this.selected_module = value.target.value;
    switch (this.selected_module) {
      case 'shop-now': this.moduleType = this.shopNowType; break;
      case 'consult-us': this.moduleType = this.consultantType; break;
      case 'lifestyle-tips': this.moduleType = this.lifestyleType; break;
      case 'general': this.moduleType = this.general; break;
    }
  }

  getTypeBasedList(value: any) {
    this.selected_type = (value.target as any).value;
    switch (this.selected_type) {
      case 'Category': this.getCategoryList(); break;
      case 'Consultant Type': this.getConsultantTypes(); break;
      case 'Blog': this.getBlogList(); break;
      case 'Brand': this.getBrandList(); break;
      case 'Health Concern': this.getHealthConcern(); break;
    }
  }

  onChangeList(event: any) {
    this.selected_list = event.target.value;
    switch (this.selected_type) {
      case 'Category': this.payload.categoryId = this.selected_list; break;
      case 'Consultant Type': this.payload.consultantTypeId = this.selected_list; break;
      case 'Brand': this.payload.brandId = this.selected_list; break;
      case 'Health Concern': this.payload.healthConcernId = this.selected_list; break;
    }
  }

  getCategoryList() {
    if (this.selected_type == 'Category' && this.selected_module == 'shop-now') {
      this.api.getCategoryList(` ? limit=${this.pageSize}&page=${this.page}`).subscribe({
        next: (res : any) => {
          setTimeout(() => {
            if (res.data.categories) {
              this.dataArray = res.data.categories;
              this.total = res.data.count;
              this.cdr.detectChanges();
            }
          });
        }
      });
    } else if (this.selected_type == 'Category' && this.selected_module == 'lifestyle-tips') {
      this.api.getCategoryListing(` ? categoryType=LifeStyle&limit=${this.pageSize}&page=${this.page}`).subscribe({
        next: (res : any) => {
          setTimeout(() => {
            if (res.data) {
              this.dataArray = res.data;
              this.total = res.data.count;
              this.cdr.detectChanges();
            }
          });
        }
      });
    }
  }

  getBrandList() {
    this.api.getBrandList(` ? limit=${this.pageSize}&page=${this.page}`).subscribe({
       next: (res : any) => {
        setTimeout(() => {
          if (res.data.brands) {
            res.data.brands.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            this.dataArray = res.data.brands;
            this.total = res.data.count;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  getHealthConcern() {
    this.spinner.show();
    this.api.getHealthConcernList(` ? limit=${this.pageSize}&page=${this.page}`).subscribe({
      next: (res : any) => {
        setTimeout(() => {
          this.spinner.hide();
          if (res.data.healthConcerns) {
            res.data.healthConcerns.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            this.dataArray = res.data.healthConcerns;
            this.total = res.data.count;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => this.spinner.hide()
    });
  }

  getBlogList() {
    const params = { limit: this.pageSize, page: this.page };
    this.lifestyle.getBlogList(params).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if (res.data) {
            this.dataArray = res.data;
            this.total = res.count;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  getConsultantTypes() {
    this.api.getTypes(`limit=${this.pageSize}&page=${this.page}`).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          if (res.data) {
            this.dataArray = res.data;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  onSubmit() {
    let value: any = { ...this.form.value };
    value.isLink = value.isLink === "true";
    this.spinner.show();
    this.payload.module = value.module;
    this.payload.name = value.name;
    this.payload.type = value.type;
    this.payload.parent = value.parent;
    this.payload.url = value.url;
    this.payload.target = value.target;
    this.payload.isLink = value.isLink;

    switch (this.payload.type) {
      case 'Category': this.payload.categoryId = value.list || null; break;
      case 'Consultant Type': this.payload.consultantTypeId = value.list || null; break;
      case 'Brand': this.payload.brandId = value.list || null; break;
      case 'Health Concern': this.payload.healthConcernId = value.list || null; break;
    }

    const req = this.editId ? this.api.updateMenu({ ...this.payload, _id: this.editId }) : this.api.createMenu(this.payload);
    req.subscribe({
      next: () => {
        setTimeout(() => {
          this.spinner.hide();
          this.toastr.success(`Menu ${this.editId ? 'updated' : 'created'} successfully!`);
          this.router.navigateByUrl('/ecommerce/menu');
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Something went wrong!');
      }
    });
  }
}
