import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MenuList } from "src/app/core/models/menu.models";
import { ApiService, RequestHttpParams } from "src/app/core/services/api.service";
import { CashFreeRefundResponse } from "src/app/types/xhr.types";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EcommerceService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) { }

  /**Search Related API */
  algoliaSearch(name: string) {
    return this.http.get<{ count: number, data1: { hits: Array<any> }, success: boolean }>(`${environment.apiUrl}algoliasearch?name=${name}`);
  }

  syncAlgolia(data = '') {
    return this.http.post(`${environment.apiUrl}algoliasearch`, data);
  }

  /** File Upload API */
  fileUpload(files: File[], folder?: string) {
    let fd = new FormData();
    for (let file of files) {
      fd.append('file', file)
    }
    if (folder) {
      fd.append('folder', folder);
    }
    return this.http.post<{ success: boolean, data: string[] }>(`${environment.apiUrl}upload`, fd);
  }

  /**Attribute Related API */
  getAttributeSet() {
    return this.http.get(`${environment.apiUrl}attributeSets`);
  }
  addAttributeSet(data) {
    return this.http.post(`${environment.apiUrl}attributeSets`, data);
  }
  deleteAttributeSet(_id) {
    return this.http.delete(`${environment.apiUrl}attributeSets?id=${_id}`);
  }
  updateAttributeSet(data) {
    return this.http.put(`${environment.apiUrl}attributeSets`, data);
  }
  getAttributes(data) {
    return this.http.get(`${environment.apiUrl}attributeSets/attribute?attributeSetId=${data}`);
  }
  addAttribute(data) {
    return this.http.post(`${environment.apiUrl}attributeSets/attribute`, data);
  }
  deleteAttribute(_id) {
    return this.http.delete(`${environment.apiUrl}attributeSets/attribute?id=${_id}`);
  }
  updateAttribute(data) {
    return this.http.post(`${environment.apiUrl}attributeSets/editattribute`, data);
  }

  /**Banner Related API */
  getBannerList() {
    return this.http.get(`${environment.apiUrl}banners`);
  }
  addBanner(data) {
    return this.http.post(`${environment.apiUrl}banners`, data);
  }
  getBannerDetail(_id) {
    return this.http.get(`${environment.apiUrl}banners/detail?id=${_id}`);
  }
  removeBanner(id) {
    return this.http.delete(`${environment.apiUrl}banners?id=${id}`);
  }
  updateBanner(data) {
    return this.http.put(`${environment.apiUrl}banners`, data);
  }


  /**Promotional Banner Related API */
  getPromotionalBannerList(params?: { limit?: number, page?: number, title?: string }) {
    return this.api.get('promotionBanner/getPromotionBanner', params);
  }
  addPromotionalBanner(data) {
    return this.http.post(`${environment.apiUrl}promotionBanner/createPromotionBanner`, data);
  }
  getPromotionalBannerDetail(_id) {
    return this.http.get(`${environment.apiUrl}promotionBanner/getPromotionBannerById/${_id}`);
  }
  removePromotionalBanner(id) {
    const body = { '_id': id };
    const options: any = {
      body: body
    };
    return this.http.delete(`${environment.apiUrl}promotionBanner/deletePromtionBanner`, options);
  }
  updatePromotionalBanner(data) {
    return this.http.put(`${environment.apiUrl}promotionBanner/updatePromotionBanner`, data);
  }




  /**Brand Related API */
  getBrandListingAll() {
    return this.http.get(`${environment.apiUrl}brands/list`)
  }
  getBrandList(url) {
    return this.http.get(`${environment.apiUrl}brands${url}`);
  }
  addBrand(data) {
    return this.http.post(`${environment.apiUrl}brands`, data);
  }
  removeBrand(id) {
    return this.http.delete(`${environment.apiUrl}brands?id=${id}`);
  }
  toggleBrandTop(data) {
    return this.http.post(`${environment.apiUrl}brands/top`, data);
  }
  getBrand(_id: string) {
    return this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}brands/detail?filter=false&_id=${_id}`);
  }
  updateBrand(data) {
    return this.http.put(`${environment.apiUrl}brands`, data);
  }

  /**Blog Related API */
  getBlogList() {
    return this.http.get(`${environment.apiUrl}blogs`);
  }

  /**Category Related API */
  getCategoryListingAll() {
    return this.http.get(`${environment.apiUrl}categories/list`);
  }
  getCategoryList(url) {
    return this.http.get(`${environment.apiUrl}categories${url}`);
  }
  getCategory(_id: string) {
    return this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}categories/detail?filter=false&_id=${_id}`);
  }
  addCategory(data) {
    return this.http.post(`${environment.apiUrl}categories`, data);
  }
  updateCategory(data) {
    return this.http.put(`${environment.apiUrl}categories`, data);
  }
  toggleCategoryTop(data) {
    return this.http.post(`${environment.apiUrl}categories/top`, data);
  }
  toggleCategoryFeatured(data) {
    return this.http.post(`${environment.apiUrl}categories/featured`, data);
  }
  getParentCategories() {
    return this.http.get(`${environment.apiUrl}categories/getparentcategory`);
  }
  removeCategory(id) {
    return this.http.delete(`${environment.apiUrl}categories/${id}`);
  }


  getCategoryListing(categoryType) {
    // categories/list?categoryType=LifeStyle
    return this.http.get(`${environment.apiUrl}categories/list${categoryType}`);
  }
  /**Coupon Related API */
  addCoupon(data) {
    return this.http.post(`${environment.apiUrl}coupons`, data);
  }
  getCoupons() {
    return this.http.get(`${environment.apiUrl}coupons`);
  }
  getCouponDetail(value) {
    return this.http.get(`${environment.apiUrl}coupons/detail?_id=${value}`);
  }
  updateCoupon(data) {
    return this.http.put(`${environment.apiUrl}coupons`, data);
  }
  removeCoupon(id) {
    return this.http.delete(`${environment.apiUrl}coupons?_id=${id}`);
  }

  /**Health Concern Related API */
  getHealthConcernListingAll() {
    return this.http.get(`${environment.apiUrl}healthconcerns/list`);
  }
  getHealthConcernList(url: any) {
    return this.http.get(`${environment.apiUrl}healthconcerns${url}`);
  }
  addHealthConcern(data) {
    return this.http.post(`${environment.apiUrl}healthconcerns`, data);
  }
  toggleHealthConcernTop(data) {
    return this.http.post(`${environment.apiUrl}healthconcerns/top`, data);
  }
  toggleHealthConcernFeatured(data) {
    return this.http.post(`${environment.apiUrl}healthconcerns/featured`, data);
  }
  getHealthConcern(_id: string) {
    return this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}healthconcerns/detail?products=false&filter=false&_id=${_id}`);
  }
  updateHealthConcern(data) {
    return this.http.put(`${environment.apiUrl}healthconcerns`, data);
  }
  removeHealthConcern(id) {
    return this.http.delete(`${environment.apiUrl}healthConcerns?id=${id}`);
  }

  /**Image Upload API */
  uploadImage(data) {
    return this.http.post(`${environment.apiUrl}upload`, data)
  }

  /**Menu Related API */
  getMenuList() {
    return this.http.get<MenuList>(`${environment.apiUrl}menus`);
  }
  createMenu(data: { name: string, type: string, url: string, target: string, parent: string }) {
    return this.http.post(`${environment.apiUrl}menus`, data);
  }
  updateMenu(data: { _id: string, name: string, type: string, url: string, target: string, parent: string }) {
    return this.http.put(`${environment.apiUrl}menus`, data);
  }
  deleteMenu(id: string) {
    return this.http.delete(`${environment.apiUrl}menus/${id}`);
  }

  /**Order Related API */
  getEnquiryList(params?: RequestHttpParams) {
    return this.api.get('enquiry/all', params)
  }
  getDetailsByEnquiryId(params?: RequestHttpParams) {
    return this.api.get('enquiry/', params)
  }
  deleteEnquiryById(enquiryId) {
    return this.api.delete(`enquiry/${enquiryId}`);
  }
//international enquiry use  APIs
  getIntEnquiryList(params?: RequestHttpParams) {
    return this.api.get('int-enquiry/all', params)
  }
  getIntEnquiryDetailsById(params?: RequestHttpParams) {
    return this.api.get('int-enquiry/', params)
  }
  deleteIntEnquiryById(enquiryId) {
    return this.api.delete(`int-enquiry/${enquiryId}`);
  }

  getOrdersList(params?: RequestHttpParams) {
    return this.api.get('orders', params)
  }
  getAbandonedCartList(params?: RequestHttpParams) {
    return this.api.get('carts/list', params)
  }
  getAwaitedList(params?: RequestHttpParams) {
    return this.api.get('orders/awaited', params)
  }
  getInvoicesBulk(params: RequestHttpParams) {
    return this.api.get('orders/getInvoice', params);
  }
  sendInvoices(data = null) {
    return this.http.post(`${environment.apiUrl}orders/sendInvoice`, data);
  }
  getOrderDetails(id) {
    return this.http.get(`${environment.apiUrl}orders/detail?_id=${id}`);
  }
  fetchWayBill(url) {
    return this.http.get(`${environment.apiUrl}shipments/fetchwaybill?${url}`);
  }
  createShipmentsOrder(data) {
    return this.http.post(`${environment.apiUrl}shipments/createorder`, data);
  }
  createPackagingSlip(waybill) {
    return this.http.get(`${environment.apiUrl}shipments/createpackageslip?waybill=${waybill}&pdf=true`);
  }
  createPickUpRequest(data) {
    return this.http.post(`${environment.apiUrl}shipments/createpickuprequest`, data);
  }
  createShipment(data) {
    return this.http.post(`${environment.apiUrl}shipments/create`, data);
  }
  getShipmentDetail(id) {
    return this.http.get(`${environment.apiUrl}shipments/detail?shippingId=${id}`);
  }
  updateShipment(data) {
    return this.http.put(`${environment.apiUrl}shipments/update`, data);
  }
  deleteOrder(id) {
    return this.http.delete(`${environment.apiUrl}orders/${id}`);
  }

  cancelOrder(_id) {
    return this.http.post(`${environment.apiUrl}orders/cancel`, { _id });
  }
  cancelOrderProducts(data: { _id: string, reason: string, comment: string, products: { productId: string, quantity: number }[] }) {
    return this.http.post(`${environment.apiUrl}orders/cancelproduct`, data);
  }
  adminCheckout(data) {
    return this.http.post(`${environment.apiUrl}carts/admincheckout`, data);
  }

  applyCoupon(data) {
    return this.http.post(`${environment.apiUrl}coupons/applycoupon`, data);
  }

  createOrder(data) {
    return this.http.post(`${environment.apiUrl}orders/admin`, data);
  }

  getRefundableAmount(_id: string) {
    return this.http.get(`${environment.apiUrl}orders/refundamount?_id=${_id}`);
  }

  refundOrder(data: { orderId: string, refundAmount: number }) {
    return this.http.post<CashFreeRefundResponse>(`${environment.apiUrl}payments//cashfree-applyRefund`, data);
  }

  updatePaymentStatus(data: { _id: string, paymentStatus: string, paymentType: string, paymentMethod: string, txnId?: string, txnDate: string, }) {
    return this.http.post(`${environment.apiUrl}payments/updatepaymentstatus`, data);
  }
  /**Product Related API */
  getProductList(params?: RequestHttpParams) {
    return this.api.get('products', params);
  }
  getProductListAll(url) {
    return this.http.get(`${environment.apiUrl}${url}`);
  }
  addProduct(data) {
    return this.http.post(`${environment.apiUrl}products`, data);
  }
  updateProduct(data) {
    return this.http.put(`${environment.apiUrl}products`, data);
  }
  getProductDetail(_id) {
    return this.http.get(`${environment.apiUrl}products/detail?_id=${_id}`);
  }
  getRelatedBlogs(url) {
    return this.http.get(`${environment.apiUrl}products/blogs?_id=${url}`);
  }
  getUpsellProducts(url) {
    return this.http.get(`${environment.apiUrl}products/upsell?_id=${url}`);
  }
  getCrossSellProducts(url) {
    return this.http.get(`${environment.apiUrl}products/crosssell?_id=${url}`);
  }
  removeProduct(id) {
    return this.http.delete(`${environment.apiUrl}products/${id}`);
  }
  toggleApprove(data) {
    return this.http.post(`${environment.apiUrl}products/is`, data);
  }
  getProductsReviews(queryParams?: RequestHttpParams) {
    return this.api.get<{ status: boolean, count: number, data: any[] }>('products/allreview', queryParams)
  }

  verifyReview(_id: string, verified: boolean) {
    return this.api.post<{ status: boolean, data: any }>('products/verifyreview', { _id, verified });
  }

  publishReview(_id: string, publish: boolean) {
    return this.api.post<{ status: boolean, data: any }>('products/publishreview', { _id, publish })
  }

  /**Season Related API */
  getSeasonList() {
    return this.http.get<{ data: Array<{ _id: string, season: string, startMonth: string, endMonth: string, }>, success: boolean }>(`${environment.apiUrl}seasons`);
  }
  createSeason(data: { season: string, startMonth: string, endMonth: string }) {
    return this.http.post(`${environment.apiUrl}seasons`, data);
  }
  getSeasonDetail(id) {
    // return this.http.get(`${environment.apiUrl}seasons`)
  }
  removeSeason(id) {
    return this.http.delete(`${environment.apiUrl}seasons?id=${id}`);
  }

  /**Tax Related API */
  getTaxes() {
    return this.http.get(`${environment.apiUrl}taxes`);
  }
  addTaxClass(data) {
    return this.http.post(`${environment.apiUrl}taxes/class`, data);
  }
  addTaxes(data) {
    return this.http.post(`${environment.apiUrl}taxes`, data);
  }
  removeTaxClass(data) {
    return this.http.request('delete', `${environment.apiUrl}taxes/class`, { body: data });
  }

  /**Types Related API */
  getTypes(url = '') {
    return this.http.get(`${environment.apiUrl}types?${url}`);
  }
  addTypes(data) {
    return this.http.post(`${environment.apiUrl}types`, data)
  }
  updateTypes(data) {
    return this.http.put(`${environment.apiUrl}types`, data)
  }
  removeType(data) {
    return this.http.delete(`${environment.apiUrl}types?id=${data}`);
  }
  getTypeDetail(id) {
    return this.http.get(`${environment.apiUrl}types/detail?_id=${id}`);
  }

  /**User Related API */
  getUserList(queryParams = {}) {
    let params = new HttpParams({ fromObject: queryParams });
    return this.http.get(`${environment.apiUrl}users/admin`, { params });
  }
  getUserListAll() {
    return this.http.get(`${environment.apiUrl}users/list?role=User`);
  }
  forgotPassword(body: { email: string }) {
    return this.http.put(`${environment.apiUrl}auth/forgotPassword`, body);
  }
  changePassword(body: { oldPassword: string, newPassword: string, confirmPassword: string }) {
    return this.http.put(`${environment.apiUrl}users/changepassword`, body);
  }
  /** Address Related */
  getUserAddressArea(pincode) {
    return this.http.get(`${environment.apiUrl}users/getaddress?pincode=${pincode}`);
  }

  /**Variation Related API */
  getVariations() {
    return this.http.get(`${environment.apiUrl}products/getvariations`);
  }
  addVariation(data) {
    return this.http.post(`${environment.apiUrl}products/addvariation`, data);
  }
  deleteVariation(_id) {
    return this.http.get(`${environment.apiUrl}products/deletevariations/${_id}`);
  }
  updateVariation(data) {
    return this.http.put(`${environment.apiUrl}products/updatevariation`, data);
  }

  /**Health Packages */
  addHealthPackage(data) {
    return this.http.post(environment.apiUrl + 'healthPackages', data)
  }

  updateHealthPackage(id: string, data) {
    return this.http.put(environment.apiUrl + 'healthPackages/' + id, data)
  }

  getHealthPackage(slug: string) {
    return this.http.get(environment.apiUrl + 'healthPackages/detail/', { params: { slug, isAdmin: 'true' } })
  }

  searchHealthPackages(params: { keyword: string }) {
    return this.api.get<{ success: boolean, data: Array<any>, total: number }>('healthPackages', params)
  }

  createHealthPackageSubscription(data) {
    return this.api.post('healthpackagebuy/byadmin', data)
  }

}
