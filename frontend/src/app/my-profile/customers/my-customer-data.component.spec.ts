import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCustomerDataComponent } from './my-customer-data.component';

describe('CustomersComponent', () => {
  let component: MyCustomerDataComponent;
  let fixture: ComponentFixture<MyCustomerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCustomerDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCustomerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
