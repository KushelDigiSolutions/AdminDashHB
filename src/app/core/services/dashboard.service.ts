import { Injectable } from '@angular/core';
import { ApiService, RequestHttpParams } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private api: ApiService,
  ) { }


  getTotalRevenue(params?: RequestHttpParams) {
    return this.api.get('report/totalrevenue', params)
  }

  getTotalExpense(params?: RequestHttpParams) {
    return this.api.get('report/totalexpense', params)
  }

  getNetProfit(params?: RequestHttpParams) {
    return this.api.get('report/netProfit', params)
  }

  getGrossProfit(params?: RequestHttpParams) {
    return this.api.get('report/gross', params)
  }

  getRevenueChartData(params?: RequestHttpParams) {
    return this.api.get('report/barchart', params)
  }

  getSalesGrowth(params?: RequestHttpParams) {
    return this.api.get('report/sales', params)
  }

  getTopProducts(params?: RequestHttpParams) {
    return this.api.get('report/topproduct', params)
  }

  getTopCategories(params?: RequestHttpParams) {
    return this.api.get('report/topcateory', params)
  }

  getTopBrands(params?: RequestHttpParams) {
    return this.api.get('report/topbrand', params)
  }

  getTopConsults(params?: RequestHttpParams) {
    return this.api.get('report/topconsult', params)
  }

  getTodaysReport(params?: RequestHttpParams) {
    return this.api.get('report/today', params)
  }

  getTopCustomersByRevenue(params?: RequestHttpParams) {
    return this.api.get('report/topcustomer', params)
  }
  getCustomersOrderChartData(params?: RequestHttpParams) {
    return this.api.get('report/customergraph', params)
  }

  getAverageOrderValue(params?: RequestHttpParams) {
    return this.api.get('report/averageorder', params)
  }
}
