import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferpostingComponent } from './transferposting.component';

describe('TransferpostingComponent', () => {
  let component: TransferpostingComponent;
  let fixture: ComponentFixture<TransferpostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferpostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferpostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
