import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products/products.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { ShopsComponent } from './shops/shops.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { CategoryComponent } from './category/category.component';
import { BrandComponent } from './brand/brand.component';
import { HealthConcernComponent } from './health-concern/health-concern.component';
import { AttributesComponent } from './products/attributes/attributes.component';
import { AttributeListingComponent } from './products/attributes/attribute-listing/attribute-listing.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { AddHealthConcernComponent } from './health-concern/add-health-concern/add-health-concern.component';
import { AddBrandComponent } from './brand/add-brand/add-brand.component';
import { VariationsComponent } from './products/variations/variations.component';
import { TaxesComponent } from './products/taxes/taxes.component';
import { BannersComponent } from './banners/banners.component';
import { AddBannerComponent } from './banners/add-banner/add-banner.component';
import { SeasonsComponent } from './seasons/seasons.component';
import { AddSeasonComponent } from './seasons/add-season/add-season.component';
import { MenuComponent } from './menu/menu.component';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';
import { CouponsComponent } from './coupons/coupons.component';
import { AddCouponsComponent } from './coupons/add-coupons/add-coupons.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { ShippmentComponent } from './orders/shippment/shippment.component';
import { EnquiryListComponent } from './orders/enquiry-list/enquiry-list.component';
import { EnquiryDetailComponent } from './orders/enquiry-detail/enquiry-detail.component';
import { InternationalEnquiryListComponent } from './orders/international-enquiry-list/international-enquiry-list.component';
import { InternationalEnquiryDetailComponent } from './orders/international-enquiry-detail/international-enquiry-detail.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { AbandonedCartComponent } from './abandoned-cart/abandoned-cart.component';
import { AwaitedOrderComponent } from './awaited-order/awaited-order.component';
import { ProductsReviewsComponent } from './products/products-reviews/products-reviews.component';
import { AddPromotionalBannerComponent } from './promotional-banner/add-promotional-banner/add-promotional-banner.component';
import { PromotionalBannerComponent } from './promotional-banner/promotional-banner.component';

const routes: Routes = [
    {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'product-detail/:id',
        component: ProductdetailComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'shops',
        component: ShopsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'add-product',
        component: AddproductComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'products/reviews',
        component: ProductsReviewsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'ProductManager'] }
    },
    {
        path: 'products/edit-product/:id',
        component: AddproductComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'orders/enquiries',
        component: EnquiryListComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'orders/international-enquiries',
        component: InternationalEnquiryListComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'orders/international-enquiries/:id',
        component: InternationalEnquiryDetailComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'orders/enquiries/:id',
        component: EnquiryDetailComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'abandoned-cart',
        component: AbandonedCartComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin'] }
    },
    {
        path: 'awaited-order',
        component: AwaitedOrderComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin'] }
    },
    {
        path: 'orders/order-detail/:id',
        component: OrderDetailComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'orders/create-order',
        component: CreateOrderComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'orders/shipment/:id',
        component: ShippmentComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'orders/shipment/edit/:id',
        component: ShippmentComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'Accountant', 'CMSManager'] }
    },
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'category/:id',
        component: CategoryComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'add-category',
        component: AddCategoryComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'category/edit/:id',
        component: AddCategoryComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'brands',
        component: BrandComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'add-brands',
        component: AddBrandComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'brands/edit/:id',
        component: AddBrandComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'health-concerns',
        component: HealthConcernComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'health-concerns/:id',
        component: HealthConcernComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'health-concerns/:id/edit/:id',
        component: AddHealthConcernComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'health-concerns/edit/:id',
        component: AddHealthConcernComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'add-health-concerns',
        component: AddHealthConcernComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'attributes',
        component: AttributesComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'attributes/:id',
        component: AttributeListingComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'variations',
        component: VariationsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'taxes',
        component: TaxesComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager', 'ProductManager'] }
    },
    {
        path: 'banners',
        component: BannersComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'add-banner',
        component: AddBannerComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'banners/edit/:id',
        component: AddBannerComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'seasons',
        component: SeasonsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'seasons/create',
        component: AddSeasonComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'seasons/edit/:id',
        component: AddSeasonComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'menu/create',
        component: AddMenuComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'menu/edit/:id',
        component: AddMenuComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'coupons',
        component: CouponsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'add-coupon',
        component: AddCouponsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'coupons/edit/:id',
        component: AddCouponsComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'promotional-banners',
        component: PromotionalBannerComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'add-promotional-banner',
        component: AddPromotionalBannerComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
    {
        path: 'promotional-banners/edit/:id',
        component: AddPromotionalBannerComponent,
        canActivate: [AuthGuard],
        data: { role: ['Admin', 'CMSManager'] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule { }
