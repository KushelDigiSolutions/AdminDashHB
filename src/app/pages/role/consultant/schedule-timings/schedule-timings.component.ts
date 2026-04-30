import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { isValidTime, mintToTimeFormat, time24to12, timeToMintFormat } from 'src/app/util/date.util';
import { ConsultantApiService } from '../consultant-api.service';

@Component({
  standalone: false,
  selector: 'app-schedule-timings',
  templateUrl: './schedule-timings.component.html',
  styleUrls: ['./schedule-timings.component.scss']
})
export class ScheduleTimingsComponent implements OnInit {

  breadCrumbItems = [
    { label: "Home" },
    { label: "Schedule Timings", active: true },
  ];

  activeDay = 'Sunday';
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  profileData: any;
  slotsDataObj = {};

  form: any = this.fb.group({
    slotDuration: ['00:30', Validators.required],
    timeSlots: this.fb.array([]),
  });

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private api: ConsultantApiService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    this.spinner.show();
    this.api.getProfile().subscribe((res: any) => {
      this.spinner.hide()
      this.profileData = res.data;
      this.profileData.timeSlots.forEach(slot => {
        this.slotsDataObj[slot.day] = slot;
      });
      this.form.patchValue({ slotDuration: mintToTimeFormat(this.profileData.slotDuration) || '00:30' });

      this.days.forEach(day => {
        let slot = this.profileData.timeSlots.find(el => day == el.day);
        if (slot) {
          this.timeSlotsFA.push(this.createTimeSlot(day, slot.availableTime.map(el => ({ startTime: el.startTime, endTime: el.endTime }))));
        } else {
          this.timeSlotsFA.push(this.createTimeSlot(day, []));
        }
      });

    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      this.toastr.error(err.error?.message || 'Something went wrong!');
    });
  }

  createTimeSlot(day = '', availableTime = []) {
    return this.fb.group({
      day: [day],
      availableTime: this.fb.array(availableTime.map(el => this.createAvailableTimeFG(el.startTime, el.endTime)))
    })
  }

  createAvailableTimeFG(startTime = '', endTime = '') {
    return this.fb.group({
      startTime: [startTime, [Validators.required, this.timeIntersectionValidator('startTime')]],
      endTime: [endTime, [Validators.required, this.endTimeValidator(), this.timeIntersectionValidator('endTime')]],
    });
  }

  get timeSlotsFA() {
    return <FormArray>this.form.get('timeSlots')
  }

  get availableTimeFA() {
    return <FormArray>this.form.get('timeSlot').get('availableTime')
  }

  addTimeSlot(formGroup: FormGroup) {
    (<FormArray>formGroup.get('availableTime')).push(this.createAvailableTimeFG())
  }

  removeTimeSlot(formGroup: FormGroup, i: number) {
    (<FormArray>formGroup.get('availableTime')).removeAt(i);
  }

  onChangeDay(day: string) {
    if (this.activeDay == day) return;
    this.activeDay = day;
  }

  onChangeStartTime(control: FormGroup) {
    control.get('endTime').updateValueAndValidity();
  }

  endTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      let startTime = control.parent.get('startTime').value;
      let endTime = control.value;
      if (!endTime || !startTime || !isValidTime(startTime) || !isValidTime(endTime)) return null;
      let [stHour, stMint] = startTime.split(':')
      let [etHour, etMint] = endTime.split(':')
      stHour = parseInt(stHour);
      stMint = parseInt(stMint);
      etHour = parseInt(etHour);
      etMint = parseInt(etMint);
      return stHour < etHour || stHour == etHour && stMint < etMint ? null : { endTime: true };
    };
  }

  timeIntersectionValidator(type: 'startTime' | 'endTime'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let time = control.value, matchTime = false;
      if (!time || !isValidTime(time) || !control.parent) return null;
      const parentFG = control.parent;
      const availableTimeFA = parentFG.parent;
      let controlsArray: any = availableTimeFA.controls;
      for (let i = 0; i < controlsArray.length; i++) {
        const formGroup = availableTimeFA.controls[i];
        if (parentFG == formGroup) continue;
        let { startTime, endTime } = formGroup.value;
        if (isValidTime(startTime) && isValidTime(endTime)) {
          matchTime = time == startTime || time == endTime || (time > startTime && time < endTime);
          if (!matchTime) {
            let pair = [];
            let secondPair = parentFG.value[type == 'startTime' ? 'endTime' : 'startTime'];
            if (type == 'startTime') {
              pair = [time, secondPair];
            } else {
              pair = [secondPair, time];
            }
            matchTime = isValidTime(secondPair) && pair[0] < startTime && pair[1] > endTime;
          }
          if (matchTime) break;
        }
      }
      return matchTime ? { timeIntersect: true } : null;
    };
  }

  onSubmit() {
    let value = JSON.parse(JSON.stringify(this.form.value)),
      currentUser = this.authenticationService.currentUser();

    let data = {
      _id: currentUser._id,
      slotDuration: timeToMintFormat(value.slotDuration),
      timeSlots: value.timeSlots
    }

    this.spinner.show();
    this.api.updateProfileByAdmin(data).subscribe(res => {
      this.spinner.hide()
      this.toastr.success('Timings updated successfully')
    }, (err: HttpErrorResponse) => {
      this.toastr.error(err.error?.message || 'Something went wrong!');
      this.spinner.hide()
    });
  }
}
