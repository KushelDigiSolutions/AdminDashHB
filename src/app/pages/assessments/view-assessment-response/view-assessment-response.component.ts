import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentsService } from '../assessments.service';
import { ChartType } from '../chartjs/chartjs.model';
import { donutChart } from '../chartjs/data';

@Component({
  standalone: false,
  selector: 'app-view-assessment-response',
  templateUrl: './view-assessment-response.component.html',
  styleUrls: ['./view-assessment-response.component.scss'],
})
export class ViewAssessmentResponseComponent implements OnInit {
  breadcrumb = [{ label: 'Assessments' }, { label: 'Survey Report', active: true }];
  overviewChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: ['#0000FF', '#FF5349', '#2dd57c'],
        hoverBackgroundColor: ['#0000FF', '#FF5349', '#2dd57c'],
        hoverBorderColor: '#fff',
      },
    ],
  };
  public vataChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: ['#0000FF', '#ccf'],
        hoverBackgroundColor: ['#0000FF', '#ececec'],
        hoverBorderColor: '#fff',
      },
    ],
  };
  pittaChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: ['#FF5349', '#ffdddb'],
        hoverBackgroundColor: ['#FF5349', '#ececec'],
        hoverBorderColor: '#fff',
      },
    ],
  };
  kaphaChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: ['#2dd57c', '#d5f7e5'],
        hoverBackgroundColor: ['#2dd57c', '#ececec'],
        hoverBorderColor: '#fff',
      },
    ],
  };

  data: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private assessmentService: AssessmentsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    let { id } = this.route.snapshot.params;
    this.getSurveyResponse(id);
  }

  getSurveyResponse(id: string) {
    this.assessmentService.getSurveyResponse(id).subscribe(
      (res) => {
        let { success, data } = res;
        if (success) {
          this.data = data;
          let { vata, pitta, kapha } = this.data.analysis;

          this.overviewChartJs.datasets[0].data = [vata, pitta, kapha];
          this.vataChartJs.datasets[0].data = [vata, 100 - vata];
          this.pittaChartJs.datasets[0].data = [pitta, 100 - pitta];
          this.kaphaChartJs.datasets[0].data = [kapha, 100 - kapha];
          this.cdr.markForCheck();
        }
      },
      (err: HttpErrorResponse) => {},
    );
  }
}
