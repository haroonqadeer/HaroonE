import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingemployeeComponent } from './trainingemployee.component';

describe('TrainingemployeeComponent', () => {
  let component: TrainingemployeeComponent;
  let fixture: ComponentFixture<TrainingemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
