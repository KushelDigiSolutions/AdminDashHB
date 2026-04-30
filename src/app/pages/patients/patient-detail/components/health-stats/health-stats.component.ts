import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultantApiService } from 'src/app/pages/role/consultant/consultant-api.service';
import { getTotalDaysInMonth, getFormatedDate, prependZero, getDaysDifference } from 'src/app/util/date.util';
import SwiperCore, { Navigation, SwiperOptions } from 'swiper';
import { VitalChartData } from '../vital-chart/vital-chart.component';
import { tempdata } from './data';

SwiperCore.use([Navigation]);

@Component({
  standalone: false,
  selector: 'app-health-stats',
  templateUrl: './health-stats.component.html',
  styleUrls: ['./health-stats.component.scss']
})
export class HealthStatsComponent implements OnInit, AfterViewInit {

  @Input() userId: string;

  tabs = {
    symptoms: {
      label: 'Symptoms'
    },
    vitals: {
      label: 'Vitals'
    },
  }
  activeTab: 'symptoms' | 'vitals' = 'vitals';

  config: SwiperOptions = {
    slidesPerView: 7,
    spaceBetween: 0,
    navigation: false,
    // pagination: { clickable: true },
    // scrollbar: { draggable: true },
  };

  vitalsData = {
    height: [],
    weight: [],
    pulse: [],
    temperature: [],
    respiratoryRate: [],
    spo: [],
    bloodPressure: [],
  }
  vitals: { [key: string]: VitalChartData } = {
    height: {},
    weight: {},
    pulse: {},
    temperature: {},
    respiratoryRate: {},
    spo: {},
    bloodPressure: {},
  };

  rangeForm: FormGroup;
  maxDate: NgbDate;

  firstRenderSymptomsSlider = true;
  symptomsData = [];
  symptomsList = [];
  sliderDate: Date;
  symptomsFilters = {};
  selectedDay = null;

  constructor(
    private modalService: NgbModal,
    private consultantApiService: ConsultantApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.initRangeForm()
    this.getVitals();
    this.changeSymptomsFilterDate()
    this.updateSymptomsSlider()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200)
  }

  initRangeForm() {
    let currentDate = new Date()
    let startDate: any = new Date();
    this.maxDate = new NgbDate(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    startDate.setDate(startDate.getDate() - getTotalDaysInMonth(startDate))
    startDate = new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

    this.rangeForm = this.fb.group({
      endDate: [this.maxDate, Validators.required],
      startDate: [startDate, Validators.required],
    })
  }

  changeSymptomsFilterDate(action?: 'next' | 'prev') {
    let startDate = '';
    let endDate = '';
    let date: Date;
    this.firstRenderSymptomsSlider = false;
    // this.sliderDate.setHours(0, 0, 0, 0);

    if (action == 'next') {
      if (this.isSameMonthAndYear(this.sliderDate)) return;
      date = new Date(this.sliderDate);
      date = new Date(date.setMonth(date.getMonth() + 1))

      let month = date.getMonth() + 1;
      startDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-01`
      endDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${getTotalDaysInMonth(date)}`
    } else if (action == 'prev') {
      date = new Date(this.sliderDate);
      date.setMonth(date.getMonth() - 1)

      let month = date.getMonth() + 1;
      startDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-01`
      endDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${getTotalDaysInMonth(date)}`
    } else {
      date = new Date()
      let month = date.getMonth() + 1;

      startDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-01`
      endDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${getTotalDaysInMonth(date)}`
    }

    this.sliderDate = date;
    this.symptomsFilters = {
      startDate,
      endDate
    }

    this.getSymptoms()

  }

  resetVitalsData(){
    this.vitalsData = {
      height: [],
      weight: [],
      pulse: [],
      temperature: [],
      respiratoryRate: [],
      spo: [],
      bloodPressure: [],
    }
  }

  getVitals() {
    let { invalid, value } = this.rangeForm;

    if (invalid) return;
    let { startDate, endDate } = value;

    let reqData = {
      userId: this.userId,
      startDate: `${startDate.year}-${prependZero(startDate.month)}-${prependZero(startDate.day)}`,
      endDate: `${endDate.year}-${prependZero(endDate.month)}-${prependZero(endDate.day)}`
    }
    console.log(value);

    this.resetVitalsData();
    this.consultantApiService.getUserVitals(reqData).subscribe(res => {
      let { success, data } = res;
      if (success && data) {
        data.forEach(el => {
          Object.keys(el.vitals).forEach(key => {
            if (!this.vitalsData[key]) this.vitalsData[key] = [];
            this.vitalsData[key].push({ ...el.vitals[key], createdBy: el.createdBy })
          })
        });
        console.log({ vitalsData: this.vitalsData });
        this.updateVitalsGraph()
      } else {

      }
    }, (err: HttpErrorResponse) => {

    })
  }

  getSymptoms() {
    this.spinner.show()
    this.consultantApiService.getUserSymptoms({ userId: this.userId, ...this.symptomsFilters }).subscribe(res => {
      this.spinner.hide()
      let { success, data } = res;
      if (success && data) {
        this.symptomsData = data;
        this.updateSymptomsSlider()
      } else {

      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()

    })
  }

  onChangeTab(key) {
    this.activeTab = key;
  }

  onSwiper(swiper) {
    console.log(swiper);
    swiper.activeIndex = this.getCurrentDay() - 1;
  }
  onSlideChange() {
    console.log('slide change');
  }

  openModal(modal) {
    this.modalService.open(modal, {
      size: "lg",
      windowClass: "modal-holder",
      centered: true,
    })
  }

  onUpdatedStats(data: { type: 'vitals' | 'symptom', payload: any }) {
    this.modalService.dismissAll();
    if (data.type == 'symptom') {
      if (this.isSameMonthAndYear(this.sliderDate)) {
        this.symptomsData.push(data.payload)
        this.updateSymptomsSlider();
      }
    } else {
      this.getVitals()
    }

  }

  updateVitalsGraph() {
    this.createBarChart()
    this.createAreaChart()
    this.createBloodPressureChart()
  }

  createBarChart() {
    ['height', 'weight'].forEach(vital => {
      let seriesData = []
      let categories = []

      this.vitalsData[vital]?.forEach((el, index) => {
        seriesData.push(el.value)
        categories.push(el.date)
      })

      this.vitals[vital] = {
        series: [seriesData],
        xaxis: {
          categories
        }
      };
    })

    this.vitals = { ...this.vitals };
    console.log('[graph data]', this.vitals);
  }

  createAreaChart() {
    ['pulse', 'temperature', 'respiratoryRate', 'spo'].forEach(vital => {
      let seriesData = []
      let categories = []

      this.vitalsData[vital]?.forEach((el, index) => {
        seriesData.push(el.value)
        categories.push(el.date)
      })

      this.vitals[vital] = {
        series: [seriesData],
        xaxis: {
          categories
        }
      };
    })
  }

  createBloodPressureChart() {
    ['bloodPressure'].forEach(vital => {
      let seriesData = []
      let seriesData2 = []
      let categories = []

      this.vitalsData[vital]?.forEach((el, index) => {
        let [systolic, diastolic] = el.value.split('/')
        seriesData.push(systolic)
        seriesData2.push(diastolic)
        categories.push(el.date)
      })

      this.vitals[vital] = {
        series: [seriesData, seriesData2],
        xaxis: {
          categories
        }
      };
    })
  }

  updateSymptomsSlider() {
    let days = getTotalDaysInMonth(this.sliderDate)
    if (this.isSameMonthAndYear(this.sliderDate)) {
      days = this.getCurrentDay();
    }
    let date = new Date(this.sliderDate)
    let month = date.getMonth() + 1;
    let monthString = date.toString().slice(4, 7);
    this.symptomsList = new Array(days).fill(null).map((_, index) => {
      let day = index + 1;
      let symptoms = this.symptomsData.filter(el => getFormatedDate(el.createdAt) == `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`)
      return {
        label: `${day < 10 ? '0' + day : day} ${monthString}`,
        day,
        symptoms
      }
    })

  }

  onSelectDay(data) {
    this.selectedDay = data;
  }

  getCurrentDay() {
    return new Date().getDate();
  }
  isSameMonthAndYear(date: string | Date) {
    let currentDate = new Date()
    date = new Date(date);
    return currentDate.getMonth() == date.getMonth() && currentDate.getFullYear() == date.getFullYear()
  }
  onDateSelect(event) {
    console.log(event);

  }
}
