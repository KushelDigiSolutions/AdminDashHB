import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { EcommerceRoutingModule } from "./ecommerce-routing.module";
import { UIModule } from "../../shared/ui/ui.module";

import {
  NgbNavModule,
  NgbDropdownModule,
  NgbPaginationModule,
  NgbTooltipModule,
  NgbAccordionModule,
  NgbTypeaheadModule,
  NgbCollapseModule,
  NgbDatepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { HbSwitchComponent } from "src/app/shared/ui/hb-switch/hb-switch.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ModalsModule } from "./modals/modals.module";
import { BulkExportModule } from "src/app/shared/bulk-export/bulk-export.module";
import { DropzoneModule } from "src/app/components/dropzone/dropzone.module";

// Import all Standalone components
import { ProductsComponent } from "./products/products.component";
import { ProductdetailComponent } from "./productdetail/productdetail.component";
import { ShopsComponent } from "./shops/shops.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CartComponent } from "./cart/cart.component";
import { AddproductComponent } from "./addproduct/addproduct.component";
import { CustomersComponent } from "./customers/customers.component";
import { OrdersComponent } from "./orders/orders.component";
import { NgbdSortableHeader } from "./sortable-directive";
import { CategoryComponent } from "./category/category.component";
import { BrandComponent } from "./brand/brand.component";
import { HealthConcernComponent } from "./health-concern/health-concern.component";
import { AttributesComponent } from "./products/attributes/attributes.component";
import { AttributeListingComponent } from "./products/attributes/attribute-listing/attribute-listing.component";
import { AddCategoryComponent } from "./category/add-category/add-category.component";
import { AddHealthConcernComponent } from "./health-concern/add-health-concern/add-health-concern.component";
import { AddBrandComponent } from "./brand/add-brand/add-brand.component";
import { RelatedBlogsComponent } from "./addproduct/related-blogs/related-blogs.component";
import { RelatedProductsComponent } from "./addproduct/related-products/related-products.component";
import { VariationsComponent } from "./products/variations/variations.component";
import { TaxesComponent } from "./products/taxes/taxes.component";
import { BannersComponent } from "./banners/banners.component";
import { AddBannerComponent } from "./banners/add-banner/add-banner.component";
import { SeasonsComponent } from "./seasons/seasons.component";
import { AddSeasonComponent } from "./seasons/add-season/add-season.component";
import { MenuComponent } from "./menu/menu.component";
import { AddMenuComponent } from "./menu/add-menu/add-menu.component";
import { CouponsComponent } from './coupons/coupons.component';
import { AddCouponsComponent } from './coupons/add-coupons/add-coupons.component';
import { OrderDetailComponent } from "./orders/order-detail/order-detail.component";
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { ShippmentComponent } from './orders/shippment/shippment.component';
import { EnquiryListComponent } from './orders/enquiry-list/enquiry-list.component';
import { EnquiryDetailComponent } from './orders/enquiry-detail/enquiry-detail.component';
import { InternationalEnquiryListComponent } from './orders/international-enquiry-list/international-enquiry-list.component';
import { InternationalEnquiryDetailComponent } from './orders/international-enquiry-detail/international-enquiry-detail.component';
import { AbandonedCartComponent } from './abandoned-cart/abandoned-cart.component';
import { AwaitedOrderComponent } from './awaited-order/awaited-order.component';
import { ProductsReviewsComponent } from './products/products-reviews/products-reviews.component';
import { AddPromotionalBannerComponent } from "./promotional-banner/add-promotional-banner/add-promotional-banner.component";
import { PromotionalBannerComponent } from "./promotional-banner/promotional-banner.component";

@NgModule({
  declarations: [],
  imports: [
    NgbdSortableHeader,
    CommonModule,
    ModalsModule,
    EcommerceRoutingModule,
    NgbNavModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    UIModule,
    BulkExportModule,
    TranslateModule.forChild(),
    HbSwitchComponent,
    NgSelectModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    CKEditorModule,
    NgxDropzoneModule,
    NgbDatepickerModule,
    DropzoneModule,
    // Add all Standalone components to imports
    ProductsComponent,
    ProductdetailComponent,
    ShopsComponent,
    CheckoutComponent,
    CartComponent,
    AddproductComponent,
    CustomersComponent,
    OrdersComponent,
    CategoryComponent,
    BrandComponent,
    HealthConcernComponent,
    AttributesComponent,
    AttributeListingComponent,
    AddCategoryComponent,
    AddHealthConcernComponent,
    AddBrandComponent,
    RelatedBlogsComponent,
    RelatedProductsComponent,
    VariationsComponent,
    TaxesComponent,
    BannersComponent,
    AddBannerComponent,
    SeasonsComponent,
    AddSeasonComponent,
    MenuComponent,
    AddMenuComponent,
    CouponsComponent,
    AddCouponsComponent,
    OrderDetailComponent,
    CreateOrderComponent,
    ShippmentComponent,
    EnquiryListComponent,
    EnquiryDetailComponent,
    InternationalEnquiryListComponent,
    InternationalEnquiryDetailComponent,
    AbandonedCartComponent,
    AwaitedOrderComponent,
    ProductsReviewsComponent,
    AddPromotionalBannerComponent,
    PromotionalBannerComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
})
export class EcommerceModule { }
