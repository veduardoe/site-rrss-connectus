import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestInfoComponent } from './interest-info.component';

describe('InterestInfoComponent', () => {
  let component: InterestInfoComponent;
  let fixture: ComponentFixture<InterestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
