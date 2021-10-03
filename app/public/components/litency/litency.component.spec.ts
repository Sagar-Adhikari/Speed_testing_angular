import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LitencyComponent } from './litency.component';

describe('LitencyComponent', () => {
  let component: LitencyComponent;
  let fixture: ComponentFixture<LitencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LitencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LitencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
