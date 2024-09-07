import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingComponent } from './page-heading.component';

describe('PageHeadingComponent', () => {
  let component: PageHeadingComponent;
  let fixture: ComponentFixture<PageHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageHeadingComponent]
    });
    fixture = TestBed.createComponent(PageHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
