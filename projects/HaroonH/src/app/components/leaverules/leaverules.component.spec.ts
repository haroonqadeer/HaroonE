import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaverulesComponent } from './leaverules.component';

describe('LeaverulesComponent', () => {
  let component: LeaverulesComponent;
  let fixture: ComponentFixture<LeaverulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaverulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaverulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
