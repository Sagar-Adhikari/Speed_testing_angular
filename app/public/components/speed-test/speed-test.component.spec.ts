import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedTestComponent } from './speed-test.component';

describe('SpeedTestComponent', () => {
  let component: SpeedTestComponent;
  let fixture: ComponentFixture<SpeedTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
