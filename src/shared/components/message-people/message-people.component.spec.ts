import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePeopleComponent } from './message-people.component';

describe('MessagePeopleComponent', () => {
  let component: MessagePeopleComponent;
  let fixture: ComponentFixture<MessagePeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagePeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
