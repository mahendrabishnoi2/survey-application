import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOptionsComponent } from './add-options.component';

describe('AddOptionsComponent', () => {
  let component: AddOptionsComponent;
  let fixture: ComponentFixture<AddOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
