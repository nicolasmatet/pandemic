import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayroomComponent } from './playroom.component';

describe('PlayroomComponent', () => {
  let component: PlayroomComponent;
  let fixture: ComponentFixture<PlayroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
