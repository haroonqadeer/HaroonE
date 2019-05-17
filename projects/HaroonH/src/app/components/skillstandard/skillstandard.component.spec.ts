import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillstandardComponent } from './skillstandard.component';

describe('SkillstandardComponent', () => {
  let component: SkillstandardComponent;
  let fixture: ComponentFixture<SkillstandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillstandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillstandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
