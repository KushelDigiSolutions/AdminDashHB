import { Component, Input, OnInit } from '@angular/core';
import { getDataClone } from 'src/app/util/data.util';

export interface InsightsChartData {
  title: string,
  chartData: Array<{ label: string, labelValue: number, value: number }>
}

@Component({
  standalone: false,
  selector: 'app-insights-chart',
  templateUrl: './insights-chart.component.html',
  styleUrls: ['./insights-chart.component.scss']
})
export class InsightsChartComponent implements OnInit {

  @Input() data: InsightsChartData;

  defaultPieChart = {
    chart: {
      height: 220,
      type: 'pie',
    },
    series: [],
    labels: [],
    colors: ['#058f46', '#b6dec9'],
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
    dataLabels: {
      show: false,
      enabled: false,
    },

    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          height: 200
        },
        legend: {
          show: false
        },
      }
    }]
  };

  pieChart: any = getDataClone(this.defaultPieChart);

  constructor() { }

  ngOnInit(): void {
    let clone = getDataClone(this.defaultPieChart);
    this.data.chartData?.forEach(data => {
      clone.series.push(data.value)
      clone.labels.push(data.label)
    })
    this.pieChart = clone;
  }

}
