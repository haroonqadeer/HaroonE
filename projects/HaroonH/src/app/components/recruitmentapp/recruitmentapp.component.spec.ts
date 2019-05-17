import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentappComponent } from './recruitmentapp.component';

describe('RecruitmentappComponent', () => {
  let component: RecruitmentappComponent;
  let fixture: ComponentFixture<RecruitmentappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
