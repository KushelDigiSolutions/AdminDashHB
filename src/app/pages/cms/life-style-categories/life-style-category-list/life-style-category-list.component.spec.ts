import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeStyleCategoryListComponent } from './life-style-category-list.component';

describe('LifeStyleCategoryListComponent', () => {
  let component: LifeStyleCategoryListComponent;
  let fixture: ComponentFixture<LifeStyleCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeStyleCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeStyleCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
