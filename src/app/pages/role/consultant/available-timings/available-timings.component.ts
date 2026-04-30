import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { currentDate, getFormatedDate, time24to12, weekdays } from 'src/app/util/date.util';
import { ConsultantApiService } from '../consultant-api.service';

@Component({
  standalone: false,
  selector: 'app-available-timings',
  templateUrl: './available-timings.component.html',
  styleUrls: ['./available-timings.component.scss']
})
export class AvailableTimingsComponent implements OnInit {

  breadCrumbItems = [
    { label: "Home" },
    { label: "Available Slots", active: true },
  ];
  user: User | null;
  profileData: any;
  timeSlot = {
    day: weekdays[0],
    slots: []
  };
  todayDate = new Date();
  minDate = this.getDatepickerFormat(this.todayDate)

  searchForm = this.fb.group({
    date: [this.minDate]
  });

  constructor(
    private fb: FormBuilder,
    private api: ConsultantApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser()
    this.fetchProfile()
  }

  fetchProfile() {
    this.spinner.show();
    this.getAvailableTimeSlot();
    // this.api.getProfile().subscribe((res: any) => {
    //   this.profileData = res.data;
    //   this.profileData.timeSlots
    //   this.populateDaySlots(this.todayDate);

    // }, (err: HttpErrorResponse) => {

    // }, () => this.spinner.hide());
  }

  getAvailableTimeSlot(date: Date | string = new Date()) {

    let startDate = getFormatedDate(date, "YYYY-MM-DD");
    // this.endDate = new Date(date).setDate(date.getDate() + 6);
    // this.endDate = getFormatedDate(this.endDate, "YYYY-MM-DD");
    this.spinner.show();
    forkJoin([
      this.api.getSlots(this.user._id, startDate),
      this.api.getUnavailableSlots(this.user._id)
    ]).subscribe((res: any) => {
      this.spinner.hide();

      let { slots } = res[0].data;
      let unavailableSlots = res[1].data;
      unavailableSlots = unavailableSlots.filter(slot => startDate == getFormatedDate(slot.date));

      if (unavailableSlots.length) {
        slots = slots.map(slot => {
          slot.available = !unavailableSlots.find(uaSlot => uaSlot.slot == slot.startTime + ' - ' + slot.endTime);
          return slot;
        });
      }

      slots = slots.map(slot => {
        slot.startTime12 = time24to12(slot.startTime);
        slot.endTime12 = time24to12(slot.endTime);
        return slot;
      });
      console.log('[updated slots]', slots);
      this.timeSlot = { ...res[0].data, slots };

    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });
  }

  getDatepickerFormat(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }

  changeDatepickerFormatToNormal(date: { year: number, month: number, day: number }): string {
    let clone: any = { ...date };
    clone.month = clone.month < 10 ? '0' + clone.month : clone.month;
    clone.day = clone.day < 10 ? '0' + clone.day : clone.day;
    return clone.year + '-' + clone.month + '-' + clone.day;
  }

  onSearch() {
    let { value } = this.searchForm;
    console.log(value);
  }

  onDateChange() {
    let { value } = this.searchForm;
    console.log(value.date);
    let date = this.changeDatepickerFormatToNormal(value.date);
    // this.populateDaySlots(date);
    this.getAvailableTimeSlot(date)
  }

  populateDaySlots(date: Date) {
    let weekday = weekdays[date.getDay()];
    let timeSlot = this.profileData.timeSlots.find(el => el.day == weekday);
    if (timeSlot) {
      timeSlot.slots = timeSlot.slots.map(el => {
        el.startTime12 = time24to12(el.startTime);
        return el;
      });
      this.timeSlot = timeSlot;
      console.log(timeSlot);
    } else {
      this.timeSlot = { day: weekday, slots: [] }
    }
  }

  onChangeAvailability(event, timeSlot, slot) {
    console.log(event, timeSlot, slot);
    let { checked } = event.target;
    let { date } = this.searchForm.value;
    let data = {
      date: this.changeDatepickerFormatToNormal(date),
      slot: slot.startTime + ' - ' + slot.endTime,
    }

    this.spinner.show();
    let req: Observable<{ success: boolean, message: string }>;

    if (checked) {
      req = this.api.removeUnavailableslot(data);
    } else {
      req = this.api.addUnavailableslot(data);
    }

    req.subscribe(res => {
      if (res.success) {
        slot.available = false;
        this.toastr.success('Updated availability successfully');
      }
      else {
        event.target.checked = slot.available;
        this.toastr.error('Something went wrong!');
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      event.target.checked = slot.available;
      this.toastr.error(err.error?.message || 'Something went wrong!');
    }, () => this.spinner.hide());

    // this.api.updateSlotAvailability(data).subscribe(res => {
    //   if (res.success) {
    //     slot.available = checked;
    //     this.toastr.success('Updated availability successfully');
    //   }
    //   else {
    //     event.target.checked = slot.available;
    //     this.toastr.error('Something went wrong!');
    //   }
    // }, (err: HttpErrorResponse) => {
    //   this.spinner.hide()
    //   event.target.checked = slot.available;
    //   this.toastr.error(err.error?.message || 'Something went wrong!');

    // }, () => this.spinner.hide());
  }

  getSlots() {
    let value = prompt()
    if (value) {
      this.api.getSlots(this.user._id, value).subscribe(res => {

      }, err => {

      });
    }
  }

  getUnavailableSlot() {
    this.api.getUnavailableSlots(this.user._id).subscribe(res => {

    }, err => {

    });
  }
}
