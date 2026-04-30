import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';

import { ChartType } from './chartjs.model';
import { lineAreaChart, lineBarChart, pieChart, donutChart, radarChart, polarChart } from './data';

@Component({
  standalone: true,
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss'],
  imports: [CommonModule, BaseChartDirective, PagetitleComponent]
})

/**
 * chartjs-chart component
 */
export class ChartjsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Line Chart
  lineAreaChart: ChartType;
  // Bar Chart
  lineBarChart: ChartType;
  // Pie Chart
  pieChart: ChartType;
  // Donut Chart
  donutChart: ChartType;
  // Polar area Chart
  ScatterChart: ChartType;
  // Radar Chart
  radarChart: ChartType;
  // polarChart
  polarChart: ChartType;

  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Charts' }, { label: 'Chartjs', active: true }];

   /**
    * Fetches the data
    */
    this._fetchData();
  }

  /**
   * Fetch chart's data
   */
  private _fetchData() {
    // Line Chart data
    this.lineAreaChart = lineAreaChart;
    // Bar Chart data
    this.lineBarChart = lineBarChart;
    // Pie Chart data
    this.pieChart = pieChart;
    // Donut Chart
    this.donutChart = donutChart;

    // Radar Chart data
    this.radarChart = radarChart;
    // Financial Report
    this.polarChart = polarChart;
  }

}
