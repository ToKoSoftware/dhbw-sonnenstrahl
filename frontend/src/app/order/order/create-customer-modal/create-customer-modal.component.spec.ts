import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerModalComponent } from './create-customer-modal.component';

describe('CreateCustomerComponent', () => {
  let component: CreateCustomerModalComponent;
  let fixture: ComponentFixture<CreateCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
