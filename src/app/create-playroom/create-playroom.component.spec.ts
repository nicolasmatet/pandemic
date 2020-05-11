import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlayroomComponent } from './create-playroom.component';

describe('CreatePlayroomComponent', () => {
  let component: CreatePlayroomComponent;
  let fixture: ComponentFixture<CreatePlayroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePlayroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlayroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
