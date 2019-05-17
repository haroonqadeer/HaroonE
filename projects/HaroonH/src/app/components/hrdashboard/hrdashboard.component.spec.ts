import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrdashboardComponent } from './hrdashboard.component';

describe('HrdashboardComponent', () => {
  let component: HrdashboardComponent;
  let fixture: ComponentFixture<HrdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
