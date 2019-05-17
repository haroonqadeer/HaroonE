import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceStandComponent } from './performance-stand.component';

describe('PerformanceStandComponent', () => {
  let component: PerformanceStandComponent;
  let fixture: ComponentFixture<PerformanceStandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceStandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceStandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
