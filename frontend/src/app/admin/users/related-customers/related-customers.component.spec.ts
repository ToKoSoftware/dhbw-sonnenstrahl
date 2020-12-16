import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedCustomersComponent } from './related-customers.component';

describe('RelatedCustomersComponent', () => {
  let component: RelatedCustomersComponent;
  let fixture: ComponentFixture<RelatedCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
