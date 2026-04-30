import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { transactions, lineColumAreaChart, revenueColumnChart, customerRadialBarChart, orderRadialBarChart, growthColumnChart, columnlabelChart, simplePieChart } from './data';

import { ChartType } from './dashboard.model';
import { ConsultationService } from '../../consultation/consultation.service';
import { currentDate, getFormatedDate } from 'src/app/util/date.util';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ConsultantApiService } from '../../role/consultant/consultant-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { EcommerceService } from '../../ecommerce/ecommerce.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

export class DefaultComponent implements OnInit {

  lineColumAreaChart: ChartType;
  revenueColumnChart: ChartType;
  orderRadialBarChart: ChartType;
  customerRadialBarChart: ChartType;
  growthColumnChart: ChartType;
  columnlabelChart: ChartType;
  simplePieChart: ChartType;
  transactions;
  breadCrumbItems: Array<{}>;

  user: User;
  isAdmin = false;
  userRole = [];
  todaysBookings = "-";
  upcomingBookings = "-";
  monthsEarning = "";
  totalEarning = "";
  profileData: any;
  isCollapsed = {
    revenue: true,
    expense: true,
  };

  donutChart: ChartType = {
    chart: {
        height: 100,
        width: 100,
        type: 'donut',
    },
    series: [44, 55],
    legend: {
        show: false,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
    },
    // labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    colors: ['#34c38f', '#5b73e8'],
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 240
            },
            legend: {
                show: false
            },
        }
    }],
};

  salesReport = {
    revenue: {
      totalRevenue: 0,
      orderRevenue: 0,
      consultationRevenue: 0,
    },
    expense: {
      totalExpense: 0,
      orderExpense: 0,
      consultationExpense: 0,
    },
    gross: {
      total: 0,
    },
    grossMargin: {
      total: 0,
    },
    salesGrowth: {
      percent: 0,
    },
    category: [],
    brand: [],
    product: [],
    consultant: []
  }

  ordersReport = {
    gross: 0,
    averageValue: 0,
    orders: [],
    refunded: [],
    cancelled: []
  }

  todaysReport = {
    revenue: 0,
    totalOrders: 0,
    appointments: [],
    orders: [],
    cancelledOrders: [],
  }

  customersReport = {
    topCustomers: [],

  }

  salesFilter = {};
  salesPagination = {
    category: {
      limit: 10,
      page: 1,
      total: 0
    },
    brand: {
      limit: 10,
      page: 1,
      total: 0
    },
    product: {
      limit: 10,
      page: 1,
      total: 0
    },
    consultant: {
      limit: 10,
      page: 1,
      total: 0
    },
  }
  ordersPagination = {
    recentOrders: {
      limit: 10,
      page: 1,
      total: 0
    },
    refunded: {
      limit: 10,
      page: 1,
      total: 0
    },
    cancelled: {
      limit: 10,
      page: 1,
      total: 0
    },
  }
  customersPagination = {
    topCustomers: {
      limit: 10,
      page: 1,
      total: 0
    },
  }
  salesGrowthFilter = { unit: "month" };
  ordersFilter = {};
  salesFG = this.fb.group({
    daterange: ['', Validators.required]
  })
  ordersFG = this.fb.group({
    daterange: ['', Validators.required]
  })

  salesGrowthUnits = {
    year: {
      label: 'Yearly'
    },
    quarterly: {
      label: 'Quarterly'
    },
    month: {
      label: 'Monthly'
    },
    week: {
      label: 'Weekly'
    },
  }

  constructor(
    private apiService: ConsultationService,
    private authService: AuthenticationService,
    private consultantApi: ConsultantApiService,
    private dashboardService: DashboardService,
    private ecommerceService: EcommerceService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUser();
    this.isAdmin = this.user.role.includes('Admin')
    this.userRole = this.user.role;
    /**
     * Fetches the data
     */
    this.fetchData();
    this.breadCrumbItems = [{ label: 'Home' }, { label: 'Dashboard', active: true }];
    if (this.isAdmin) {
      this.getSalesReport();
      this.getOrdersReport();
      this.getCustomerReport();
      this.getTodaysReport();
    } else if (this.userRole.includes('Consultant')) {
      this.fetchBookings();
      this.getProfile();
    }

  }

  /**
   * Fetches the data
   */
  private fetchData() {

    this.lineColumAreaChart = lineColumAreaChart;
    this.revenueColumnChart = revenueColumnChart;
    this.orderRadialBarChart = orderRadialBarChart;
    this.customerRadialBarChart = customerRadialBarChart;
    this.growthColumnChart = growthColumnChart;
    this.columnlabelChart = columnlabelChart;
    this.simplePieChart = simplePieChart;
    this.transactions = transactions;
  }

  getSalesReport() {
    this.getRevenue()
    // this.getTotalExpense()
    // this.getNetProfit()
    // this.getGrossProfit()
    this.getRevenueChartData()
    this.getSalesGrowth()
    this.getTopProducts()
    this.getTopCategories()
    this.getTopBrands()
    this.getTopConsults()
  }
  getOrdersReport() {
    this.getOrdersRevenue()
    this.getAverageOrderValue()
    this.getOrders()
    this.getRefundOrders()
    this.getCancelledOrders()
    this.dashboardService.getCustomersOrderChartData(this.ordersFilter).subscribe((res: any) => {
      if (res.success) {
        this.simplePieChart.series = [res.uniqueCustomer, res.repetedCustomer]
        let updated = JSON.parse(JSON.stringify(this.simplePieChart))
        updated.series = [res.uniqueCustomer, res.repetedCustomer]
        this.simplePieChart = updated;
      }
    }, (err: HttpErrorResponse) => {

    });
  }

  getTodaysReport() {
    this.getTodayOrders()
    this.getTodayCancelledOrders()

    this.dashboardService.getTodaysReport().subscribe((res: any) => {
      if (res.success) {
        let { todayAppointment, todaySaleRevenue, todayOrders } = res;
        this.todaysReport = {
          ...this.todaysReport,
          appointments: todayAppointment,
          revenue: todaySaleRevenue,
          totalOrders: todayOrders
        }
      }

    }, (err: HttpErrorResponse) => {

    });
  }

  getCustomerReport() {
    this.getTopCustomersByRevenue()
  }

  getTopCustomersByRevenue() {
    this.spinner.show()
    let { limit, page } = this.customersPagination.topCustomers
    this.dashboardService.getTopCustomersByRevenue({ limit, page }).subscribe((res: any) => {
      this.spinner.hide()
      if (res.success) {
        this.customersPagination.topCustomers.total = res.total
        this.customersReport.topCustomers = res.data
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    });
  }

  getRevenue() {
    this.dashboardService.getTotalRevenue(this.salesFilter).subscribe((res: any) => {
      if (res.success) {
        let { totalRevenues, totalExpenses, netProfit, grossMargin } = res.data
        if (totalRevenues) {
          let { totalRevenue, codRevenue, orderRevenue, consultationRevenes } = totalRevenues;
          this.salesReport.revenue = {
            totalRevenue,
            orderRevenue: Number(orderRevenue) + Number(codRevenue),
            consultationRevenue: Number(consultationRevenes)
          }
        }
        if (totalExpenses) {
          let { codExpense, onlineOrderExpenses, consultantExpense, totalExpense } = totalExpenses;
          this.salesReport.expense = {
            totalExpense: Number(totalExpense),
            orderExpense: Number(codExpense) + Number(onlineOrderExpenses),
            consultationExpense: Number(consultantExpense),
          }
        }

        this.salesReport.gross = {
          total: Number(netProfit),
        }

        this.salesReport.grossMargin = {
          total: Number(Number(grossMargin).toFixed(2)),
        }

      }
    })
  }

  // getTotalExpense() {
  //   this.dashboardService.getTotalExpense(this.salesFilter).subscribe((res: any) => {
  //     if (res.success) {
  //       this.salesReport.expense = {
  //         totalExpense: Number(res.data.totalExpense),
  //         orderExpense: Number(res.data.totalExpense),
  //         consultationExpense: 0
  //       }
  //     }
  //   }, (err: HttpErrorResponse) => {

  //   })
  // }

  // getNetProfit() {
  //   this.dashboardService.getNetProfit(this.salesFilter).subscribe((res: any) => {
  //     if (res.success) {
  //       this.salesReport.gross = {
  //         total: Number(res.data),
  //       }
  //     }
  //   }, (err: HttpErrorResponse) => {

  //   })
  // }

  // getGrossProfit() {
  //   this.dashboardService.getGrossProfit(this.salesFilter).subscribe((res: any) => {
  //     if (res.success) {
  //       this.salesReport.grossMargin = {
  //         total: Number(Number(res.data).toFixed(2)),
  //       }
  //     }
  //   }, (err: HttpErrorResponse) => {

  //   })
  // }

  getRevenueChartData() {
    this.dashboardService.getRevenueChartData(this.salesFilter).subscribe((res: any) => {
      if (res.success) {
        res.data = res.data.reverse()
        this.columnlabelChart.xaxis.categories = res.data.map(el => el.month.substr(0, 3))
        this.columnlabelChart.series[0].data = res.data.map(el => el.total)
        this.columnlabelChart = JSON.parse(JSON.stringify(this.columnlabelChart))
      }

    }, (err: HttpErrorResponse) => {

    });

  }

  onChangeSalesGrowthFilter(unit) {
    this.salesGrowthFilter.unit = unit;
    this.getSalesGrowth()
  }

  getSalesGrowth() {
    this.dashboardService.getSalesGrowth(this.salesGrowthFilter).subscribe((res: any) => {
      if (res.success) {
        this.salesReport.salesGrowth.percent = Number((res.data[2]?.revenuePercentageDifference || 0).toFixed(2))
      }

    }, (err: HttpErrorResponse) => {

    });
  }

  getTopProducts() {
    let { page, limit } = this.salesPagination.product;
    let params = { ...this.salesFilter, page, limit }
    this.spinner.show()
    this.dashboardService.getTopProducts(params).subscribe((res: any) => {
      this.spinner.hide()
      if (res.success) {
        this.salesPagination.product.total = res.total
        this.salesReport.product = res.data
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }

  getTopCategories() {
    let { page, limit } = this.salesPagination.category;
    let params = { ...this.salesFilter, page, limit }
    this.spinner.show()
    this.dashboardService.getTopCategories(params).subscribe((res: any) => {
      this.spinner.hide()
      if (res.success) {
        this.salesPagination.category.total = res.total
        this.salesReport.category = res.data
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }
  getTopBrands() {
    let { page, limit } = this.salesPagination.brand;
    let params = { ...this.salesFilter, page, limit }
    this.spinner.show()
    this.dashboardService.getTopBrands(params).subscribe((res: any) => {
      this.spinner.hide()
      if (res.success) {
        this.salesPagination.brand.total = res.total
        this.salesReport.brand = res.data
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }
  getTopConsults() {
    let { page, limit } = this.salesPagination.consultant;
    let params = { ...this.salesFilter, page, limit }
    this.spinner.show()
    this.dashboardService.getTopConsults(params).subscribe((res: any) => {
      this.spinner.hide()
      if (res.success) {
        this.salesPagination.consultant.total = res.total
        this.salesReport.consultant = res.data
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }

  getOrdersRevenue() {
    this.dashboardService.getTotalRevenue(this.ordersFilter).subscribe((res: any) => {
      if (res.success) {
        let { codRevenue, orderRevenue } = res.data.totalRevenues;
        this.ordersReport.gross = Number(orderRevenue) + Number(codRevenue);
      }
    })
  }

  getAverageOrderValue() {
    this.dashboardService.getAverageOrderValue(this.ordersFilter).subscribe((res: any) => {
      if (res.success) {
        let { orderAverage } = res.data;
        this.ordersReport.averageValue = Number(!isNaN(orderAverage) ? orderAverage : 0);
      }
    })
  }

  getOrders() {
    let { page, limit } = this.ordersPagination.recentOrders;
    let params = {
      limit, page,
      ...this.ordersFilter
    }
    this.spinner.show()
    this.ecommerceService.getOrdersList(params).subscribe((res: any) => {
      this.spinner.hide()
      if (res.status) {
        this.ordersPagination.recentOrders.total = res.data.count
        this.ordersReport.orders = res.data.orders.map((order) => {
          if (order.billingInfo) {
            order.billingInfo.fullName = this.getFullName(order.billingInfo)
          }
          return order;
        })
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }

  getRefundOrders() {
    let { page, limit } = this.ordersPagination.refunded;
    let params = {
      limit, page,
      currentStatus: ['refundInitiated', 'refunded'],
      ...this.ordersFilter
    }
    this.spinner.show()
    this.ecommerceService.getOrdersList(params).subscribe((res: any) => {
      this.spinner.hide()
      if (res.status) {
        this.ordersPagination.refunded.total = res.data.count
        this.ordersReport.refunded = res.data.orders.map((order) => {
          if (order.billingInfo) {
            order.billingInfo.fullName = this.getFullName(order.billingInfo)
          }
          return order;
        })
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }

  getCancelledOrders() {
    let { page, limit } = this.ordersPagination.cancelled;
    let params = {
      limit, page,
      currentStatus: ['cancelled'],
      ...this.ordersFilter
    }
    this.spinner.show()
    this.ecommerceService.getOrdersList(params).subscribe((res: any) => {
      this.spinner.hide()
      if (res.status) {
        this.ordersPagination.cancelled.total = res.data.count
        this.ordersReport.cancelled = res.data.orders.map((order) => {
          if (order.billingInfo) {
            order.billingInfo.fullName = this.getFullName(order.billingInfo)
          }
          return order;
        })
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
    });
  }
  getTodayOrders() {
    let startDate = currentDate()
    let endDate: any = new Date()
    endDate.setDate(endDate.getDate() + 1);
    endDate = getFormatedDate(endDate);
    let params = {
      startDate,
      endDate
    }
    this.ecommerceService.getOrdersList(params).subscribe((res: any) => {
      if (res.data) {
        this.todaysReport.orders = res.data.orders.map((order) => {
          if (order.billingInfo) {
            order.billingInfo.fullName = this.getFullName(order.billingInfo)
          }
          return order;
        })
      }
    }, (err: HttpErrorResponse) => {

    });
  }
  getTodayCancelledOrders() {
    let startDate = currentDate()
    let endDate: any = new Date()
    endDate.setDate(endDate.getDate() + 1);
    endDate = getFormatedDate(endDate);

    let params = {
      currentStatus: ['cancelled', 'refunded'],
      startDate,
      endDate
    }
    this.ecommerceService.getOrdersList(params).subscribe((res: any) => {
      if (res.data) {
        this.todaysReport.cancelledOrders = res.data.orders.map((order) => {
          if (order.billingInfo) {
            order.billingInfo.fullName = this.getFullName(order.billingInfo)
          }
          return order;
        })
      }
    }, (err: HttpErrorResponse) => {

    });
  }
  fetchBookings() {
    if (!this.user.role.includes('Consultant')) return;
    let todayDate = currentDate()
    let endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    let search = `startDate=${todayDate}&endDate=${getFormatedDate(endDate)}&consultantId=${this.user._id}`

    this.apiService.getAppointmentList(search)
      .subscribe((res: any) => {
        let todayB = 0;
        let upcomingB = 0;
        let statusList = ['Completed', 'Cancelled'];
        res.data.appointments.forEach((appt: any) => {
          let { status, date } = appt;
          if (!statusList.includes(status)) {
            todayDate == getFormatedDate(date) ? todayB++ : upcomingB++;
          }
        });
        this.todaysBookings = todayB.toString();
        this.upcomingBookings = upcomingB.toString();
        this.cdRef.detectChanges();
      }),
      (err: any) => {

      };
  }

  getProfile() {
    this.spinner.show();
    this.consultantApi.getProfile().subscribe((res: any) => {
      this.spinner.hide();
      this.profileData = res.data;

      this.profileData.hbCommission = ((this.profileData.hbCommission / 100) * this.profileData.totalEarning);

      console.log("profileDAta", this.profileData);
      // this.populateForm();
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });
  }

  getFullName(data) {
    return ((data.firstName || '') + ' ' + (data.lastName || '')).trim();
  }

  fromDate: Date;
  toDate: Date;
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;

  hidden: boolean = true;
  selected: any;
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  onDateSelection(date: NgbDate, form: FormGroup) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      // this.selected = '';
      form.patchValue({ daterange: "" })
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      // this.selected = this.fromDate.toLocaleDateString() + ' - ' + this.toDate.toLocaleDateString();
      form.patchValue({ daterange: this.fromDate.toLocaleDateString() + ' - ' + this.toDate.toLocaleDateString() })
      // this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      // this.selected = '';
      form.patchValue({ daterange: "" })
    }
  }

  resetSalesFilter() {
    this.salesFilter = {}
    this.salesFG.reset()
    this.getSalesReport()
  }

  onSubmitSales() {
    let { valid, value } = this.salesFG
    console.log({ valid, value });
    if (valid) {
      let [startDate, endDate] = value.daterange.split(' - ');
      startDate = getFormatedDate(startDate)
      endDate = getFormatedDate(endDate)
      this.salesFilter = {
        ...this.salesFilter,
        startDate,
        endDate
      }
      for (let key in this.salesPagination) {
        this.salesPagination[key].page = 1
      }

      this.getSalesReport()
    }
  }
  resetOrdersFilter() {
    this.ordersFilter = {}
    this.ordersFG.reset()
    this.getOrdersReport()
  }

  onSubmitOrders() {
    let { valid, value } = this.ordersFG
    console.log({ valid, value });
    if (valid) {
      let [startDate, endDate] = value.daterange.split(' - ');
      startDate = getFormatedDate(startDate)
      endDate = getFormatedDate(endDate)
      this.ordersFilter = {
        ...this.ordersFilter,
        startDate,
        endDate
      }

      this.getOrdersReport()
    }
  }

  changePagination(tab: 'sales' | 'orders', listType: string) {
    console.log(tab, listType, this.salesPagination);
    if (tab == 'sales') {
      switch (listType) {
        case 'category': {
          this.getTopCategories()
          break;
        }
        case 'brand': {
          this.getTopBrands()
          break;
        }
        case 'product': {
          this.getTopProducts()
          break;
        }
        case 'consultant': {
          this.getTopConsults()
          break;
        }
      }
    } else if (tab == 'orders') {
      switch (listType) {
        case 'recentOrders': {
          this.getOrders()
          break;
        }
        case 'cancelled': {
          this.getCancelledOrders()
          break;
        }
        case 'refunded': {
          this.getRefundOrders()
          break;
        }
      }
    } else if (tab == 'customers') {
      switch (listType) {
        case 'topCustomers': {
          this.getTopCustomersByRevenue()
          break;
        }
      }
    }
  }

}
