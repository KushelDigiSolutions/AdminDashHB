import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippmentComponent } from './shippment.component';

describe('ShippmentComponent', () => {
  let component: ShippmentComponent;
  let fixture: ComponentFixture<ShippmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
