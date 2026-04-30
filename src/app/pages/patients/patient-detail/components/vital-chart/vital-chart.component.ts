import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ChartType } from './vital-chart.model';
import { ChartType as ApexChartType } from './apex.model';

import { heightChart, weightChart, pulseChart, bloodPressureChart, temperatureChart, respiratoryRateChart, spoChart } from './data';

export interface VitalChartData {
  series?: Array<Array<[]>>,
  xaxis?: {
    categories?: any[]
  }
}
@Component({
  standalone: false,
  selector: 'app-vital-chart',
  templateUrl: './vital-chart.component.html',
  styleUrls: ['./vital-chart.component.scss']
})
export class VitalChartComponent implements OnInit, OnChanges {

  @Input() data: { [key: string]: VitalChartData } = {};

  breadCrumbItems: Array<{}>;
  defaultChartData = {
    heightChart,
    weightChart,
    pulseChart,
    bloodPressureChart,
    temperatureChart,
    respiratoryRateChart,
    spoChart,
  }

  heightChart: ApexChartType;
  weightChart: ApexChartType;
  pulseChart: ApexChartType;
  bloodPressureChart: ApexChartType;
  temperatureChart: ApexChartType;
  respiratoryRateChart: ApexChartType;
  spoChart: ApexChartType;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateGraphs()
  }

  ngOnInit(): void {
    this.resetGraphs()
    this.breadCrumbItems = [{ label: 'Charts' }, { label: 'Chartjs Chartist chart', active: true }];

    this.updateGraphs();
  }

  resetGraphs() {
    this.heightChart = this.makeClone(heightChart);
    this.weightChart = this.makeClone(weightChart);
    this.pulseChart = this.makeClone(pulseChart);
    this.bloodPressureChart = this.makeClone(bloodPressureChart);
    this.temperatureChart = this.makeClone(temperatureChart);
    this.respiratoryRateChart = this.makeClone(respiratoryRateChart);
    this.spoChart = this.makeClone(spoChart);
  }

  updateGraphs() {
    if (this.data) {
      this.resetGraphs();
      Object.keys(this.data).forEach(key => {
        if (Object.keys(this.data[key]).length) {
          let { xaxis, series } = this.data[key]
          let defaultData = this.makeClone(this.defaultChartData[key + 'Chart']);
          defaultData.xaxis = {
            ...this[key + 'Chart'].xaxis,
            ...xaxis
          };
          defaultData.series = defaultData.series.map((el, index) => {
            el.data = series[index];
            return el;
          })
          this[key + 'Chart'] = defaultData;
        }
      })
    }
    setTimeout(() => window.dispatchEvent(new Event('resize')), 0)
  }

  makeClone(data) {
    return JSON.parse(JSON.stringify(data))
  }
}
