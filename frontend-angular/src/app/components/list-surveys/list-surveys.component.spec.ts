import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSurveysComponent } from './list-surveys.component';

describe('ListSurveysComponent', () => {
  let component: ListSurveysComponent;
  let fixture: ComponentFixture<ListSurveysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSurveysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
