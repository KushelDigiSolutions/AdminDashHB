/*
import { Component, OnInit } from '@angular/core';

import { ChartType } from './chartist.model';
import {
  simpleLineChart, lineScatter, areaLineChart, overlappingBarChart, stackBarChart, horizontalBarChart,
  donutAnimateChart, simplePieChart
} from './data';

@Component({
  standalone: false,
  selector: 'app-chartist',
  templateUrl: './chartist.component.html',
  styleUrls: ['./chartist.component.scss']
})

export class ChartistComponent implements OnInit {

  constructor() { }

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Simple line chart
  simpleLineChart: ChartType;
  // Line Scatter Diagram
  lineScatter: ChartType;
  // Line chart with area
  areaLineChart: ChartType;
  // Overlapping bars on mobile
  overlappingBarChart: ChartType;
  // Stacked bar chart
  stackBarChart: ChartType;
  // Horizontal bar chart
  horizontalBarChart: ChartType;
  // Animating a Donut with Svg.animate
  donutAnimateChart: ChartType;
  // simple pie chart
  simplePieChart: ChartType;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Charts' }, { label: 'Chartist chart', active: true }];
    this._fetchData();
  }

  private _fetchData() {
    this.simpleLineChart = simpleLineChart;
    this.lineScatter = lineScatter;
    this.areaLineChart = areaLineChart;
    this.overlappingBarChart = overlappingBarChart;
    this.stackBarChart = stackBarChart;
    this.horizontalBarChart = horizontalBarChart;
    this.donutAnimateChart = donutAnimateChart;
    this.simplePieChart = simplePieChart;
  }
}
*/
