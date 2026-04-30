import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedCartComponent } from './abandoned-cart.component';

describe('AbandonedCartComponent', () => {
  let component: AbandonedCartComponent;
  let fixture: ComponentFixture<AbandonedCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
