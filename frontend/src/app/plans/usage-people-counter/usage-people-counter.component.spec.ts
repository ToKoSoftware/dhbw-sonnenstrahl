import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsagePeopleCounterComponent } from './usage-people-counter.component';

describe('UsagePeopleCounterComponent', () => {
  let component: UsagePeopleCounterComponent;
  let fixture: ComponentFixture<UsagePeopleCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsagePeopleCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsagePeopleCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
