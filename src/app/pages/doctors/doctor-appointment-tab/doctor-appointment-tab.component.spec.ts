import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentTabComponent } from './doctor-appointment-tab.component';

describe('DoctorAppointmentTabComponent', () => {
  let component: DoctorAppointmentTabComponent;
  let fixture: ComponentFixture<DoctorAppointmentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAppointmentTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorAppointmentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
