import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {UserData} from '../../interfaces/user.interface';
import {ApiService} from '../../services/api/api.service';
import {LoginService} from '../../services/login/login.service';
import {myProfileBreadcrumb, myProfilePages} from '../my-profile.pages';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {CustomerData} from '../../interfaces/customer.interface';

@Component({
  selector: 'app-customers',
  templateUrl: './my-customer-data.component.html'
})
export class MyCustomerDataComponent implements OnInit {
  public profilePages = myProfilePages;
  public breadcrumbs = myProfileBreadcrumb;
  public results: CustomerData[] = [];
  @ViewChild('editModal', {static: true}) editModal: TemplateRef<unknown>;
  public loading = true;
  public currentEditCustomer: CustomerData;
  public currentUser: UserData;

  constructor(
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private login: LoginService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public showEditModalForCustomer(customer: CustomerData): void {
    this.currentEditCustomer = {...customer}; // copy data
    this.modalService.showModal(`"${customer.lastName}, ${customer.firstName}" bearbeiten`, this.editModal);
  }

  public closeEditModal(): void {
    this.modalService.close();
  }

  private loadData(): void {
    this.loading = true;
    this.api.get<CustomerData[]>('/customers', {
      sort: '-lastName',
      userId: this.login.decodedJwt$.value?.id
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  /**
   * Update customer with new data
   */
  public saveEditedCustomer(): void {
    this.modalService.close();
    this.loadingService.showLoading();
    this.api.put(`/customers/${this.currentEditCustomer.id}`, {
      firstName: this.currentEditCustomer.firstName,
      lastName: this.currentEditCustomer.lastName,
      street: this.currentEditCustomer.street,
      streetNumber: this.currentEditCustomer.streetNumber,
      postcode: this.currentEditCustomer.postcode,
      city: this.currentEditCustomer.city,
    }).subscribe(
      data => {
        this.loadingService.hideLoading();
        this.loadData();
      }, error => {
        this.loadingService.hideLoading();
        this.confirmService.confirm({
          title: `Es ist ein Fehler beim Ändern aufgetreten.`,
          confirmButtonType: 'info',
          confirmText: 'Ok',
          description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
          showCancelButton: false
        });
      }
    );
  }

}
