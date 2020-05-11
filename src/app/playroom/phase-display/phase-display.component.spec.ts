import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseDisplayComponent } from './phase-display.component';

describe('PhaseDisplayComponent', () => {
  let component: PhaseDisplayComponent;
  let fixture: ComponentFixture<PhaseDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
