import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceEvaComponent } from './performance-eva.component';

describe('PerformanceEvaComponent', () => {
  let component: PerformanceEvaComponent;
  let fixture: ComponentFixture<PerformanceEvaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceEvaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceEvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
