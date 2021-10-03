import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearRecordsComponent } from './clear-records.component';

describe('ClearRecordsComponent', () => {
  let component: ClearRecordsComponent;
  let fixture: ComponentFixture<ClearRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
