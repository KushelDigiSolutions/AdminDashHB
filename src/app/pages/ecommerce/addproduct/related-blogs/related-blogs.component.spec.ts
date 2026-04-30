import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedBlogsComponent } from './related-blogs.component';

describe('RelatedBlogsComponent', () => {
  let component: RelatedBlogsComponent;
  let fixture: ComponentFixture<RelatedBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedBlogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
