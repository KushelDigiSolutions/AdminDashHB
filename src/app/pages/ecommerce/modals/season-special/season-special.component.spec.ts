import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonSpecialComponent } from './season-special.component';

describe('SeasonSpecialComponent', () => {
  let component: SeasonSpecialComponent;
  let fixture: ComponentFixture<SeasonSpecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonSpecialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
