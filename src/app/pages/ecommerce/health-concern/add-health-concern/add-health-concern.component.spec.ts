import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthConcernComponent } from './add-health-concern.component';

describe('AddHealthConcernComponent', () => {
  let component: AddHealthConcernComponent;
  let fixture: ComponentFixture<AddHealthConcernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHealthConcernComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHealthConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
