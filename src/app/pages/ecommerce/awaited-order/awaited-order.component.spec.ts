import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitedOrderComponent } from './awaited-order.component';

describe('AwaitedOrderComponent', () => {
  let component: AwaitedOrderComponent;
  let fixture: ComponentFixture<AwaitedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwaitedOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwaitedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
