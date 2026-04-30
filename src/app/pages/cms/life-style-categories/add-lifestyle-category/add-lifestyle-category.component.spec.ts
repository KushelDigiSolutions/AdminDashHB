import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLifestyleCategoryComponent } from './add-lifestyle-category.component';

describe('AddLifestyleCategoryComponent', () => {
  let component: AddLifestyleCategoryComponent;
  let fixture: ComponentFixture<AddLifestyleCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLifestyleCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLifestyleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
