import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpBottomSheetComponent } from './erp-bottom-sheet.component';

describe('ErpBottomSheetComponent', () => {
  let component: ErpBottomSheetComponent;
  let fixture: ComponentFixture<ErpBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErpBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErpBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
