import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobprofileComponent } from './jobprofile.component';

describe('JobprofileComponent', () => {
  let component: JobprofileComponent;
  let fixture: ComponentFixture<JobprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
