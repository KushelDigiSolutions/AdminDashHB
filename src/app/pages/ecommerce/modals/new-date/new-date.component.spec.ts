import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDateComponent } from './new-date.component';

describe('NewDateComponent', () => {
  let component: NewDateComponent;
  let fixture: ComponentFixture<NewDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
