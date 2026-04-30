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
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { UIModule } from '../../../shared/ui/ui.module';
import { EcommerceService } from '../ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { NewDateComponent } from '../modals/new-date/new-date.component';
import { SeasonSpecialComponent } from '../modals/season-special/season-special.component';
import { map } from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HbSwitchComponent } from '../../../shared/ui/hb-switch/hb-switch.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RelatedBlogsComponent } from './related-blogs/related-blogs.component';
import { RelatedProductsComponent } from './related-products/related-products.component';
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
    NgbModalModule,
    HbSwitchComponent,
    CKEditorModule,
    RelatedBlogsComponent,
    RelatedProductsComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  selector: "app-addproduct",
  templateUrl: "./addproduct.component.html",
  styleUrls: ["./addproduct.component.scss"],
})

/**
 * Ecommerce add-product component
 */
export class AddproductComponent implements OnInit {
  public Editor = ClassicEditor;

  imgUrl = environment.imageUrl;
  brandList = [];
  healthConcernList = [];
  categoryList = [];
  attributeSet = [];
  selectedAttributes = [];
  attributes = [];
  variations = [];
  selectedVariations = [];
  relatedBlogs = [];
  blogs = [];
  upsell = [];
  crossSell = [];
  relatedProducts: any;
  attributesData = [];
  productImagesSaved = [];
  thumbnailSaved;
  taxClasses = [];

  files: File[] = [];
  thumbnail: File[] = [];

  productDetailFormGroup: FormGroup;
  descriptionFormGroup: FormGroup;
  priceDetailFormGroup: FormGroup;
  metaDetaiFormGroup: FormGroup;
  attributeFormGroup: FormGroup;
  additionalInfoFormGroup: FormGroup;
  variationFromGroup: FormGroup;

  tempMetaTagArray = [];

  tempSwitchData = {
    tempSeasonSpecial: false,
    tempNew: false,
    hbRecommended: false,
    fragile: false,
    prescriptionRequired: false,
    returnable: false,
    featured: false,
    metaIndex: false,
    sexualWellness: false,
    lastMinuteBuy: false,
    	bulkOrder: false,
    	internationalEnq: false,
  };

  productForm = ["Raw", "Powder", "Granules", "Liquid (Arq/Asava/Arishta)", "Tablet", ""];

  new = {
    from: "",
    to: "",
    isnew: false,
  };

  seasonSpecial = {
    isSeasonSpecial: false,
    season: [],
  };

  attributeId: any;
  selectedAttributeSet: string;
  newAttributeValue: string;
  breadCrumbItems: Array<{}>;
  tempAttributeValue: any;
  showVariationAddSection = false;
  variationData = [];
  variationBox = [];
  editProduct = false;
  productId = "";
  editId;

  variations1 = {
    label: [""],
    name: "",
    weight: "",
    stock: {
      quantity: "",
      availableQuantity: "",
    },
    price: {
      mrp: "",
      minPrice: "",
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private apiService: EcommerceService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productDetailFormGroup = this.formBuilder.group({
      name: ["", [Validators.required]],
      hindiName: [""],
      brandId: ["", [Validators.required]],
      primaryCategory: ["", [Validators.required]],
      slug: [""],
      weight: [null],
      quantity: [""],
      healthConcernId: [[]],
      categories: [[]],
      maxSaleQty: [""],
      highlights: [[]],
      state: "",
      taxClass: [null],
      sequence: [],
    });

    this.priceDetailFormGroup = this.formBuilder.group({
      mrp: ["", [Validators.required]],
      minPrice: [""],
      margin: [null],
    });

    this.descriptionFormGroup = this.formBuilder.group({
      short: [""],
      long: [""],
    });

    this.metaDetaiFormGroup = this.formBuilder.group({
      metaTitle: [""],
      metaDescription: [""],
      tagsTemp: [""],
      metaIndex: [false],
      metaTags: [[]],
    });

    this.attributeFormGroup = this.formBuilder.group({
      attributeId: ["", [Validators.required]],
      value: [[]],
    });

    this.additionalInfoFormGroup = this.formBuilder.group({
      tempSeasonSpecial: [""],
      tempNew: [""],
      hbRecommended: [false],
      fragile: [false],
      prescriptionRequired: [false],
      returnable: [false],
      featured: [false],
      sexualWellness:[false],
      lastMinuteBuy:[false],
      bulkOrder:[false],
      internationalEnq: [false],
    });

    this.variationFromGroup = this.formBuilder.group({
      variantions: [[]],
      variationsValueGroup: this.formBuilder.array([], [Validators.required]),
      variationsGroup: this.formBuilder.array([]),
    });

    this.getVariations();

    this.editId = this.route.snapshot.params.id;
    this.editId ? this.getProductDetail() : (this.editProduct = false);
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Ecommerce" },
      { label: "Add Product", active: true },
    ];

    this.getBrandList();
    this.getHealthConcernList();
    this.getCategoryList();
    this.getTaxClasses();
    this.fetchAttributeSet();
    this.fetchAttributes();
  }

  getProductDetail() {
    firstValueFrom(this.apiService.getProductDetail(this.editId))
      .then((res: any) => {
        console.log("res", res);
        if (res.data) {
          this.mapDataToFields(res.data);
        }
      })
      .catch((err: any) => { });
  }

  getBrandList() {
    firstValueFrom(this.apiService.getBrandListingAll())
      .then((res: any) => {
        if (res.data) {
          this.brandList = res.data;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.error);
      });
  }

  getHealthConcernList() {
    firstValueFrom(this.apiService.getHealthConcernListingAll())
      .then((res: any) => {
        if (res.data) {
          this.healthConcernList = res.data;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.error);
      });
  }

  getCategoryList() {
    firstValueFrom(this.apiService.getCategoryListingAll())
      .then((res: any) => {
        if (res.data) {
          this.categoryList = res.data;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.error);
      });
  }

  getTaxClasses() {
    firstValueFrom(this.apiService.getTaxes())
      .then((res: any) => {
        if (res.data) {
          this.taxClasses = res.data;
        }
      })
      .catch((err: any) => { });
  }

  setAttributeId(value) {
    this.attributeId = value;
  }

  async addAttribute() {
    this.attributesData = [];
    for (let j = 0; j < this.selectedAttributes.length; j++) {
      for (let i = 0; i < this.attributes.length; i++) {
        if (this.selectedAttributes[j] == this.attributes[i]._id) {
          this.attributesData.push(this.attributes[i]);
        }
      }
    }
  }

  fetchAttributeSet() {
    firstValueFrom(this.apiService.getAttributeSet())
      .then((res: any) => {
        if (res.data.attributeSets) {
          this.attributeSet = res.data.attributeSets;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.message);
      });
  }

  addNewAttribute() {
    const data = {
      name: this.newAttributeValue,
      attributeSetId: this.selectedAttributeSet,
      isFilterable: true,
    };

    firstValueFrom(this.apiService.addAttribute(data))
      .then((res: any) => {
        if (res.data.attribute) {
          this.fetchAttributes();
          this.selectedAttributeSet = "Select Attribute Set";
          this.newAttributeValue = "";
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.error, "Error");
      });
  }

  async fetchAttributes() {
      firstValueFrom(this.apiService.getAttributes(""))
      .then((res: any) => {
        if (res.data.attributes) {
          this.attributes = res.data.attributes;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.message);
      });
  }

  async getVariations() {
    firstValueFrom(this.apiService.getVariations())
      .then((res: any) => {
        if (res.data) {
          this.variations = res.data;
          for (let k in this.variations) {
            this.variations[k].label = [""];
          }
        }
      })
      .catch((err: any) => {
        this.toaster.error(err.error.error);
      });
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  onSelect(event, type) {
    type == "gallery"
      ? this.files.push(...event.addedFiles)
      : type == "thumbnail"
        ? (this.thumbnail = [...event.addedFiles])
        : "";
  }

  onRemove(event, type) {
    type == "gallery"
      ? this.files.splice(this.files.indexOf(event), 1)
      : type == "thumbnail"
        ? this.thumbnail.splice(this.thumbnail.indexOf(event), 1)
        : "";
  }

  fetchTags(value) {
    this.tempMetaTagArray.push(value);
    this.metaDetaiFormGroup.patchValue({
      tagsTemp: "",
      metaTags: this.tempMetaTagArray,
    });
  }

  removeMetaTag(index) {
    this.tempMetaTagArray.splice(index, 1);
  }

  removeAttribute(item, i) {
    this.attributesData.splice(i, 1);

    for (let k = 0; k < this.selectedAttributes.length; k++) {
      if (this.selectedAttributes[k] == item._id) {
        this.selectedAttributes.splice(k, 1);
        this.selectedAttributes = [...this.selectedAttributes];
        break;
      }
    }
  }

  toggleFxn(data, value) {
    this.tempSwitchData[value] = !data;
    if (value == "tempNew") {
      if (this.tempSwitchData.tempNew == true) {
        this.openModal("tempNew");
      } else {
        this.new.from = "";
        this.new.to = "";
        this.new.isnew = false;
      }
    }
    if (value == "tempSeasonSpecial") {
      if (this.tempSwitchData.tempSeasonSpecial == true) {
        this.openModal("tempSeasonSpecial");
      } else {
        this.seasonSpecial.season = [];
        this.seasonSpecial.isSeasonSpecial = false;
      }
    }
  }

  openModal(data) {
    if (data == "tempNew") {
      const modalRef = this.modalService
        .open(NewDateComponent, { size: "lg" })
        .result.then(
          (result) => {
            this.new.isnew = true;
            let a = result.split("-");
            this.new.from = a[0];
            this.new.from.replace("'/'", "-");
            this.new.to = a[1];
            this.new.to.replace("'/'", "-");
          },
          (reason) => {
            console.log("reason", reason);
          }
        );
    }
    if (data == "tempSeasonSpecial") {
      const modalRef = this.modalService
        .open(SeasonSpecialComponent, { size: "lg" })
        .result.then(
          (result) => {
            this.seasonSpecial.isSeasonSpecial = true;
            this.seasonSpecial.season = result;
          },
          (reason) => {
            this.tempSwitchData.tempSeasonSpecial = false;
            this.seasonSpecial.isSeasonSpecial = false;
            this.additionalInfoFormGroup.patchValue({
              tempSeasonSpecial: false,
            });
          }
        );
    }
  }

  getRelatedBlogs(event) {
    this.relatedBlogs = event;
  }

  getRelatedProducts(event) {
    this.relatedProducts = event;
  }

  createMainVariationFormGroup(
    variationId: string,
    title: string,
    values: AbstractControl[]
  ) {
    return this.formBuilder.group({
      variationId: [variationId],
      title: [title],
      values: this.formBuilder.array(values, [Validators.required]),
    });
  }
  createVariantionValueControl(value = "") {
    return this.formBuilder.control(value);
  }

  updateVariationValueControl(vValueArr, data) {
    let arr = [];
    for (let control of vValueArr.controls) {
      for (let mainVariation of data) {
        if (control.get("variationId").value == mainVariation.variationId._id) {
          console.log("main variation", mainVariation);
          arr.push(this.formBuilder.control([mainVariation.values]));
        }
      }
    }
    return arr;
  }

  addVariation() {
    this.variationData = [];
    for (let i = 0; i < this.selectedVariations.length; i++) {
      for (let j = 0; j < this.variations.length; j++) {
        if (this.selectedVariations[i] == this.variations[j]._id) {
          this.variationData.push(this.variations[j]);
        }
      }
    }
    for (let variationID of this.variationData) {
      let found = false;
      let vValueArr = this.variationFromGroup.get(
        "variationsValueGroup"
      ) as FormArray;
      for (let control of vValueArr.controls) {
        if (control.get("variationId").value == variationID._id) {
          found = true;
          break;
        }
      }
      if (!found) {
        vValueArr.push(
          this.createMainVariationFormGroup(
            variationID._id,
            variationID.title,
            [this.createVariantionValueControl()]
          )
        );
      }
      console.log("qw", vValueArr);
    }

    console.log("var data", this.variationData);
  }

  mapMainVariations(mainVariations) {
    for (let mainVariation of mainVariations) {
      let valueControlArray = mainVariation.values.map((el) =>
        this.createVariantionValueControl(el)
      );
      (this.variationFromGroup.get("variationsValueGroup") as FormArray).push(
        this.createMainVariationFormGroup(
          mainVariation.variationId._id,
          mainVariation.variationId.title,
          valueControlArray
        )
      );
    }
  }

  addVariationType(formGroup: FormGroup) {
    console.log("control2", formGroup);
    (formGroup.controls.values as FormArray).push(
      this.createVariantionValueControl()
    );
  }

  createVariationGroup(
    label?: { [key: string]: AbstractControl },
    name = "",
    weight = "",
    quantity = null,
    availableQuantity = null,
    mrp = null,
    minPrice = null,
    margin = null,
    productId = "",
    _id = ""
  ) {
    let labels: any = {};
    if (!label) {
      for (let val of this.variationFromGroup.get("variationsValueGroup")
        .value) {
        labels[val.title] = this.formBuilder.control("", [Validators.required]);
      }
    }
    if (label) {
      // console.log("labe",label);
    }
    // console.log("[labelsObj]", labels);

    return this.formBuilder.group({
      labels: this.formBuilder.group(label || labels),
      name: [name, [Validators.required]],
      weight: [weight, [Validators.required]],
      quantity: [quantity],
      availableQuantity: [availableQuantity],
      mrp: [mrp],
      minPrice: [minPrice],
      margin: [margin],
      productId: productId,
      _id: _id
    });
  }

  getLabelValue(title) {
    return this.variationFromGroup
      .get("variationsValueGroup")
      .value.find((el) => el.title == title).values;
    return [];
  }

  createGroup() {
    console.log("this.var", this.variationFromGroup);

    let value = this.variationFromGroup.get("variationsGroup") as FormArray;
    value.push(this.createVariationGroup());
    return;
  }

  removeVariation(formGroup: FormGroup) {
    (formGroup.controls.values as FormArray).removeAt(
      formGroup.controls.values.value.length - 1
    );
  }

  removeSelectedVariation(formGroup: FormGroup, index) {
    console.log("value1", formGroup);
    let value = this.variationFromGroup.get('variationsGroup') as FormArray;
    value.removeAt(index);
    console.log("value2", formGroup);
  }

  removeImage(index) {
    this.productImagesSaved.splice(index, 1);
  }
  removeThumb() {
    this.thumbnailSaved = "";
  }

  async mapDataToFields(data) {
    console.log("data", data);
    this.editProduct = true;

    this.productId = data._id;

    this.productDetailFormGroup.patchValue({
      name: data?.name,
      hindiName: data?.hindiName,
      brandId: data?.brandId?._id,
      primaryCategory: data?.primaryCategory?._id,
      slug: data?.slug,
      quantity: data.stock.availableQuantity
        ? data.stock.availableQuantity
        : 0,
      maxSaleQty: data?.maxSaleQty,
      highlights: data?.highlights,
      weight: data.weight,
      state: data.state,
      taxClass: data.taxClass,
      sequence: data.sequence,
    });
    let healthConcernId = [];
    for (let i = 0; i < data?.healthConcernId.length; i++) {
      healthConcernId.push(data?.healthConcernId[i]._id);
    }
    let categories = [];
    for (let i = 0; i < data?.categories.length; i++) {
      categories.push(data?.categories[i]._id);
    }
    this.productDetailFormGroup.patchValue({
      healthConcernId: healthConcernId,
      categories: categories,
    });

    this.priceDetailFormGroup.patchValue({
      mrp: data?.price.mrp,
      minPrice: data?.price?.minPrice ? data?.price?.minPrice : "",
      margin: data?.price?.margin,
    });

    this.descriptionFormGroup.patchValue({
      short: data?.description?.short,
      long: data?.description?.long,
    });

    this.productImagesSaved = data.images;
    this.thumbnailSaved = data.thumbnail;

    this.metaDetaiFormGroup.patchValue({
      metaTitle: data?.metaTitle,
      metaDescription: data?.metaDescription,
      metaTags: data?.metaTags,
      metaIndex: data?.metaIndex
    });
    this.tempMetaTagArray = data?.metaTags;
    this.additionalInfoFormGroup.patchValue({
      tempSeasonSpecial: data?.is?.seasonSpecial?.isSeasonSpecial,
      tempNew: data?.is?.new?.isNew,
      hbRecommended: data?.is?.hbRecommended,
      fragile: data?.is?.fragile,
      prescriptionRequired: data?.is?.prescriptionRequired,
      returnable: data?.is?.returnable,
      featured: data?.is?.featured,
      sexualWellness: data?.is?.sexualWellness,
      lastMinuteBuy: data?.is?.lastMinuteBuy,
      bulkOrder: data?.is?.bulkOrder,
      internationalEnq: data?.is?.internationalEnq,
    });
    this.tempSwitchData.tempSeasonSpecial =
      data?.is?.seasonSpecial?.isSeasonSpecial;

    this.tempSwitchData.internationalEnq = data?.is?.internationalEnq;

    if (data?.is?.seasonSpecial) {
      let seasonIds = data.is.seasonSpecial.season.map((el: any) => el._id)
      this.seasonSpecial = {
        isSeasonSpecial: data.is.seasonSpecial.isSeasonSpecial,
        season: seasonIds
      }
    }

    for (let i = 0; i < data?.attributes.length; i++) {
      for (let j = 0; j < data?.attributes[i].attributes.length; j++) {
        this.selectedAttributes.push(
          data?.attributes[i].attributes[j].attributeId?._id
        );
      }
    }

    this.attributesData = [];
    for (let j = 0; j < this.selectedAttributes.length; j++) {
      for (let i = 0; i < data.attributes.length; i++) {
        for (let k = 0; k < data.attributes[i].attributes.length; k++) {
          if (
            this.selectedAttributes[j] ==
            data.attributes[i].attributes[k].attributeId._id
          ) {
            let attributeSetId = {
              name: data.attributes[i].name,
              _id: data.attributes[i]._id,
            };
            data.attributes[i].attributes[k].attributeSetId = attributeSetId;
            this.attributesData.push(data.attributes[i].attributes[k]);
          }
        }
      }
    }

    for (let variation of data.mainVariations) {
      this.selectedVariations.push(variation.variationId._id);
    }
    this.mapMainVariations(data?.mainVariations ? data.mainVariations : []);

    for (let variation of data.variations) {
      let labelGroup = {};
      variation.label.forEach((label) => {
        let mainVariation = data.mainVariations.find((el) =>
          el.values.includes(label)
        );
        labelGroup[mainVariation.variationId.title] = label;
      });
      let value = this.variationFromGroup.get("variationsGroup") as FormArray;
      value.push(this.createVariationGroup(
        labelGroup,
        variation.name,
        variation.weight,
        variation.stock.quantity,
        variation.stock.availableQuantity,
        variation.price.mrp,
        variation.price.minPrice,
        variation.price.margin,
        variation.productId,
        variation._id
      ));
    }

    firstValueFrom(this.apiService.getRelatedBlogs(data._id))
      .then((res: any) => {
        if (res.data.related) {
          this.blogs = res.data.related.blogs;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err);
      });

    firstValueFrom(this.apiService.getUpsellProducts(data._id))
      .then((res: any) => {
        if (res.data.related) {
          this.upsell = res.data.related.similar;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err);
      });

    firstValueFrom(this.apiService.getCrossSellProducts(data._id))
      .then((res: any) => {
        if (res.data.related) {
          this.crossSell = res.data.related.recommended;
        }
      })
      .catch((err: any) => {
        this.toaster.error(err);
      });
  }

  async save() {
    let productImages;
    let thumbnail;
    let variations = [];
    let mainVariations = [];

    for (let mainVariation of this.variationFromGroup.get(
      "variationsValueGroup"
    ).value) {
      const data = {
        variationId: mainVariation.variationId,
        values: mainVariation.values,
      };
      mainVariations.push(data);
    }

    for (let variation of this.variationFromGroup.get("variationsGroup")
      .value) {
      const data = {
        label: Object.values(variation.labels),
        name: variation.name,
        weight: variation.weight,
        stock: {
          quantity: variation.quantity,
          availableQuantity: variation.availableQuantity,
        },
        price: {
          mrp: variation.mrp,
          minPrice: variation.minPrice,
          margin: variation.margin,
        },
        productId: variation.productId ? variation.productId : '',
        _id: variation._id ? variation._id : ''
      };
      !data._id.length ? delete data._id : '';
      !data.productId ? delete data.productId : ''
      variations.push(data);
    }
    if (this.productDetailFormGroup.valid) {
      let related = {
        recommended: this.relatedProducts?.recommended
          ? this.relatedProducts?.recommended
          : [],
        similar: this.relatedProducts?.similar
          ? this.relatedProducts?.similar
          : [],
        blogs: this.relatedBlogs,
      };

      let attributes = [];

      for (let k in this.attributesData) {
        let data = {
          attributeId: this.attributesData[k]._id
            ? this.attributesData[k]._id
            : this.attributesData[k].attributeId._id,
          value: this.attributesData[k].value,
        };
        attributes.push(data);
      }
      if (this.files.length) {
        const formData = new FormData();
        for (let file of this.files) {
          formData.append("file", file);
        }
        formData.append("folder", "product/large");
        await firstValueFrom(this.apiService.uploadImage(formData))
          .then(async (res: any) => {
            if (res.data) {
              productImages = res.data;
            }
          })
          .catch((err: HttpErrorResponse) => {
            this.toaster.error(err.error?.message || 'Issue in image upload');
          });
      }

      if (this.thumbnail.length) {
        const thumbData = new FormData();
        thumbData.append("file", this.thumbnail[0]);
        thumbData.append("folder", "product/thumbnail");
        await firstValueFrom(this.apiService.uploadImage(thumbData))
          .then((res : any) => {
            if (res.data) {
              thumbnail = res.data[0];
            }
          })
          .catch((err: HttpErrorResponse) => {
            this.toaster.error(err.error?.message || 'Issue in image upload');
          });
      }
      const data = {
        ...this.productDetailFormGroup.value,
        sequence: this.productDetailFormGroup.value.sequence && this.productDetailFormGroup.value.sequence > 0 ? this.productDetailFormGroup.value.sequence : null,
        description: {
          ...this.descriptionFormGroup.value,
        },
        price: {
          ...this.priceDetailFormGroup.value,
        },
        ...this.metaDetaiFormGroup.value,
        images: productImages ? productImages : [],
        thumbnail: thumbnail,
        
        is: {
          ...this.additionalInfoFormGroup.value,
          new: {
            ...this.new,
          },
          seasonSpecial: {
            ...this.seasonSpecial,
          },
        },
        stock: {
          availableQuantity: this.productDetailFormGroup.get("quantity").value,
        },
        attributes: attributes,
        related: related,
        mainVariations: mainVariations,
        variations: variations,
        _id: "",
      };

      this.editProduct ? (data._id = this.productId) : delete data._id;

      if (!this.editProduct) {
        data.images.length ? (data.images = data.images) : delete data.images;
        data.thumbnail ? data.thumbnail : delete data.thumbnail;
        console.log("[Save]", data);

        firstValueFrom(this.apiService.addProduct(data))
          .then((res: any) => {
            if (res.data.product) {
              this.router.navigate(["ecommerce/products"]);
              this.toaster.success("Product added Successfully");
            }
          })
          .catch((err: HttpErrorResponse) => {
            this.toaster.error(err.error?.message || 'Something went wrong!');
          });
      } else {
        for (let image of this.productImagesSaved) {
          data.images.push(image._id);
        }
        data.images.length ? (data.images = data.images) : delete data.images;
        data.thumbnail
          ? (data.thumbnail = data.thumbnail)
          : (data.thumbnail = this.thumbnailSaved._id
            ? (data.thumbnail = this.thumbnailSaved._id)
            : delete data.thumbnail);

        console.log("data", data);
        firstValueFrom(this.apiService.updateProduct(data))
          .then((res: any) => {
            const { redir } = this.route.snapshot.queryParams
            this.router.navigateByUrl(redir || "/ecommerce/products");
            this.toaster.success(res.message);
          })
          .catch((err: HttpErrorResponse) => {
            this.toaster.error(err.error?.message || 'Something went wrong!');
          });
      }
    } else {
      this.toaster.error("Please fill all the required fields");
    }
  }
}
