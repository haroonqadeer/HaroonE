import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingrequirementsComponent } from './trainingrequirements.component';

describe('TrainingrequirementsComponent', () => {
  let component: TrainingrequirementsComponent;
  let fixture: ComponentFixture<TrainingrequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingrequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingrequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
