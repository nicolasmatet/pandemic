import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActioncounterComponent } from './actioncounter.component';

describe('ActioncounterComponent', () => {
  let component: ActioncounterComponent;
  let fixture: ComponentFixture<ActioncounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActioncounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActioncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
