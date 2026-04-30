import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantSpecializationComponent } from './consultant-specialization.component';

describe('ConsultantSpecializationComponent', () => {
  let component: ConsultantSpecializationComponent;
  let fixture: ComponentFixture<ConsultantSpecializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultantSpecializationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantSpecializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
