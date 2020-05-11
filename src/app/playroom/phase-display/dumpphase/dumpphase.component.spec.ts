import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DumpphaseComponent } from './dumpphase.component';

describe('DumpphaseComponent', () => {
  let component: DumpphaseComponent;
  let fixture: ComponentFixture<DumpphaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DumpphaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DumpphaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
