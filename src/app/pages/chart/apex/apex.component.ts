import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';

import { ChartType } from './apex.model';
import {
  linewithDataChart, dashedLineChart, splineAreaChart, basicColumChart,
  columnlabelChart, barChart, lineColumAreaChart,
  basicRadialBarChart, simplePieChart, donutChart
} from './data';

@Component({
  standalone: true,
  selector: 'app-apex',
  templateUrl: './apex.component.html',
  styleUrls: ['./apex.component.scss'],
  imports: [CommonModule, NgApexchartsModule, PagetitleComponent]
})

/**
 * Apex-chart component
 */
export class ApexComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  linewithDataChart: ChartType;
  dashedLineChart: ChartType;
  splineAreaChart: ChartType;
  basicColumChart: ChartType;
  columnlabelChart: ChartType;
  barChart: ChartType;
  lineColumAreaChart: ChartType;
  basicRadialBarChart: ChartType;
  simplePieChart: ChartType;
  donutChart: ChartType;

  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Charts' }, { label: 'Apex charts', active: true }];

    /**
     * Fetches the data
     */
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.linewithDataChart = linewithDataChart;
    this.dashedLineChart = dashedLineChart;
    this.splineAreaChart = splineAreaChart;
    this.basicColumChart = basicColumChart;
    this.columnlabelChart = columnlabelChart;
    this.barChart = barChart;
    this.lineColumAreaChart = lineColumAreaChart;
    this.basicRadialBarChart = basicRadialBarChart;
    this.simplePieChart = simplePieChart;
    this.donutChart = donutChart;
  }
}
