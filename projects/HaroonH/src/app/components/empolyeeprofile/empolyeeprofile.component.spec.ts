import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpolyeeprofileComponent } from './empolyeeprofile.component';

describe('EmpolyeeprofileComponent', () => {
  let component: EmpolyeeprofileComponent;
  let fixture: ComponentFixture<EmpolyeeprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpolyeeprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpolyeeprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
