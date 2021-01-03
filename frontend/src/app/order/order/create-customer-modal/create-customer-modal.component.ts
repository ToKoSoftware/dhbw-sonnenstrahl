import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api/api.service';
import {ModalService} from '../../../services/modal/modal.service';
import {OrderService} from '../../../services/order/order.service';
import {CustomerData} from '../../../interfaces/customer.interface';
import {LoginService} from '../../../services/login/login.service';

@Component({
  selector: 'app-create-customer-modal',
  templateUrl: './create-customer-modal.component.html',
  styleUrls: ['./create-customer-modal.component.scss']
})
export class CreateCustomerModalComponent implements OnInit {

  public error: boolean;
  public loading: boolean;
  public customerForm: FormGroup;

  constructor(
    private router: Router,
    private readonly api: ApiService,
    private readonly login: LoginService,
    private readonly modalService: ModalService,
    public readonly orderService: OrderService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    const postcode = this.orderService.selectedPlan$.value?.postcode || '';
    this.customerForm = this.formBuilder.group(
      {
        firstName: [''],
        lastName: [''],
        street: [''],
        streetNumber: [''],
        postcode: [postcode],
        city: [''],
        userId: [''],
      }
    );
  }

  public createCustomer(): void {
    this.api.post<CustomerData>('/customers',
      {
        ...this.customerForm.value,
        userId: this.login.decodedJwt$.value?.id
      }
    ).subscribe(
      (data) => {
        this.orderService.selectedCustomer$.next(data.data);
        this.modalService.close();
      }, error => {
        this.error = true;
        this.loading = false;
      }
    );
  }

  public closeModal(): void {
    this.modalService.close();
  }

}
