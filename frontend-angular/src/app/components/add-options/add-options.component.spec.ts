import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AddOptionsComponent } from './add-options.component';

describe('AddOptionsComponent', () => {
  let component: AddOptionsComponent;
  let fixture: ComponentFixture<AddOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
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

  it('should add unique options to the options array', () => {
    component.newOption = 'Option 1';
    component.addOption();

    expect(component.options).toEqual(['Option 1']);
    expect(component.newOption).toBe('');
    expect(component.isDuplicate).toBeFalse();
  });

  it('should flag duplicate options and not add them', () => {
    component.options = ['Option 1'];
    component.newOption = 'Option 1';
    component.addOption();

    expect(component.options).toEqual(['Option 1']);
    expect(component.isDuplicate).toBeTrue();
  });
});
