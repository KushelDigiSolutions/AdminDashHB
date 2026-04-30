import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetasComponent } from './add-metas.component';

describe('AddMetasComponent', () => {
  let component: AddMetasComponent;
  let fixture: ComponentFixture<AddMetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMetasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
