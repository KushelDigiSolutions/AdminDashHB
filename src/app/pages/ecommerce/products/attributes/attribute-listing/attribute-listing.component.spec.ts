import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeListingComponent } from './attribute-listing.component';

describe('AttributeListingComponent', () => {
  let component: AttributeListingComponent;
  let fixture: ComponentFixture<AttributeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
