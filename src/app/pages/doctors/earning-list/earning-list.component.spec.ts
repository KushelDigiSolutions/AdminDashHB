import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningListComponent } from './earning-list.component';

describe('EarningListComponent', () => {
  let component: EarningListComponent;
  let fixture: ComponentFixture<EarningListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
