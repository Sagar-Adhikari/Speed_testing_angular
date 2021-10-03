import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCountComponent } from './test-count.component';

describe('TestCountComponent', () => {
  let component: TestCountComponent;
  let fixture: ComponentFixture<TestCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
