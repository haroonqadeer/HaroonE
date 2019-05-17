import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearcalendarComponent } from './yearcalendar.component';

describe('YearcalendarComponent', () => {
  let component: YearcalendarComponent;
  let fixture: ComponentFixture<YearcalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearcalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
