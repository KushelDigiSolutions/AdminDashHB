import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayoutComponent } from './add-payout.component';

describe('AddPayoutComponent', () => {
  let component: AddPayoutComponent;
  let fixture: ComponentFixture<AddPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
