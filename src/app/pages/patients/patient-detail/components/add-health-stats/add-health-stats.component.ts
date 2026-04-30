import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { ONLY_NUMBERS_PATTERN, testPattern } from 'src/app/util/pattern.util';

@Component({
  standalone: false,
  selector: 'app-add-health-stats',
  templateUrl: './add-health-stats.component.html',
  styleUrls: ['./add-health-stats.component.scss']
})
export class AddHealthStatsComponent implements OnInit {

  @Input() type: 'vitals' | 'symptoms' = 'vitals';
  @Input() userId: string;

  @Output() updated = new EventEmitter();

  submitted = false;

  form = this.fb.group({
    vitals: this.fb.group({
      height: this.fb.group({
        unit: 'Cms',
        value: ['', [Validators.min(20), Validators.max(300)]]
      }),
      weight: this.fb.group({
        unit: 'kgs',
        value: ['', [Validators.min(1), Validators.max(500)]]
      }),
      pulse: this.fb.group({
        unit: 'BPM',
        value: ['', [Validators.min(40), Validators.max(180)]]
      }),
      temperature: this.fb.group({
        unit: '°F',
        value: ['', [Validators.pattern(/^\d+(\.\d{1})?$/), this.temperatureValidator]]
      }),
      respiratoryRate: this.fb.group({
        unit: 'min',
        value: ['', [Validators.min(5), Validators.max(30)]]
      }),
      spo: this.fb.group({
        unit: '%',
        value: ['', [Validators.min(80), Validators.max(100)]]
      }),
      bloodPressure: this.fb.group({
        unit: 'mm/Hg',
        value: ['', [this.bloodPressureValidator]]
      }),

    }),
    symptom: this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    }),
  })

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.type == 'vitals') {
      this.form.get('symptom').disable()
    } else {
      this.form.get('vitals').disable()
    }
    console.log('ngOnInit addHealthStatsComponent', this.userId);

  }

  get v() {
    return (<FormGroup>this.form.get('vitals')).controls
  }

  get s() {
    return (<FormGroup>this.form.get('symptom')).controls
  }

  temperatureValidator(control: FormControl) {
    if (control.value) {
      let parsedValue = parseFloat(control.value)
      if (isNaN(parsedValue)) return { invalidValue: true }
      if (control.value < 32 || control.value > 110) return { invalidRange: true }
    }
    return null
  }

  bloodPressureValidator(control: FormControl) {
    let value: string = control.value

    if (value) {
      let bp = value.split('/'),
        [systolic, diastolic] = bp;
      if (bp.length != 2 || !(testPattern(ONLY_NUMBERS_PATTERN, systolic) && testPattern(ONLY_NUMBERS_PATTERN, diastolic)) || !(parseInt(systolic) && parseInt(diastolic))) return { bloodPressure: true };
    }
    return null
  }

  onSubmit(): void {
    this.submitted = true;
    let { invalid, value } = this.form,
      { vitals, symptom } = value;
    console.log(invalid, value);
    if (invalid) {
      this.toastr.error('Please enter a valid data');
      return;
    }

    let data: any = {
      userId: this.userId,
    }

    let endpoint = 'vitalsByConsultant'
    if (vitals) {
      data.vitals = {}
      Object.keys(vitals).forEach(key => {
        if (vitals[key].value) data.vitals[key] = vitals[key];
      });

    } else {
      endpoint = 'symptomsByConsultant'
      data.name = symptom.name
      data.description = symptom.description
    }


    this.spinner.show()
    this.api.post('stats/' + endpoint, data).subscribe((res: any) => {
      this.spinner.hide()
      let { success, data } = res;
      if (success && data) {

        this.toastr.success('Updated Health Stats Successfully');
        this.updated.emit({ type: endpoint == 'vitalsByConsultant' ? 'vitals' : 'symptom', payload: data });

      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      this.toastr.error(err.error?.message || 'Something went wrong');
    })
  }
}
