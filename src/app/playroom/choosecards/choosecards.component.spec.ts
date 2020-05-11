import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosecardsComponent } from './choosecards.component';

describe('ChoosecardsComponent', () => {
  let component: ChoosecardsComponent;
  let fixture: ComponentFixture<ChoosecardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosecardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosecardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
