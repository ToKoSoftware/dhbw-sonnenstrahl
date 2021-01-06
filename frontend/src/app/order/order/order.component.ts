import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PlanData} from '../../interfaces/plan.interface';
import {Subscription} from 'rxjs';
import {UiBreadcrumb} from '../../ui/ui.interface';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import isBlank from 'is-blank';
import {LoginService} from '../../services/login/login.service';
import {OrderService} from '../../services/order/order.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {CustomerData} from '../../interfaces/customer.interface';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  @ViewChild('errorModal') errorModal: TemplateRef<unknown>;
  @ViewChild('loginModal') loginModal: TemplateRef<unknown>;
  @ViewChild('registerModal') registerModal: TemplateRef<unknown>;
  @ViewChild('selectCustomerModal') selectCustomer: TemplateRef<unknown>;
  @ViewChild('createCustomerModal') createCustomer: TemplateRef<unknown>;
  public plan: PlanData;
  public loading = false;
  private routeSubscription: Subscription;
  private loginSubscription: Subscription;
  private customerSubscription: Subscription;
  public estimatedUsage: number;
  public breadcrumbs: UiBreadcrumb[] = [
    {routerLink: '/', title: 'Home'},
    {routerLink: '', title: 'Laden...'},
    {routerLink: '', title: 'Laden...'},
  ];
  public currentStep = 1;
  public customersOfCurrentUserCount = 0;

  constructor(
    public readonly loginService: LoginService,
    public readonly orderService: OrderService,
    private readonly confirmService: ConfirmModalService,
    private readonly loadingModalService: LoadingModalService,
    private readonly modalService: ModalService,
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    // get notified when the current user changes
    this.loginSubscription = this.loginService.decodedJwt$.subscribe(jwt => {
      if (jwt === null) {
        // No current user available
        this.customersOfCurrentUserCount = 0;
        return;
      }
      if (this.currentStep === 2) {
        this.currentStep++;
      }
      this.api.get<CustomerData[]>('/customers', {
        userId: jwt.id // fix admin being able to see all customers
      }).subscribe(d => this.customersOfCurrentUserCount = d.data.length);
    });
    this.customerSubscription = this.orderService.selectedCustomer$.subscribe(customer => {
      if (this.currentStep != 1) {
        if (customer !== null) {
          this.currentStep++;
        }
      }
    });
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.loadingModalService.showLoading();
      this.loading = true;
      if (isBlank(params.get('usage')) || isBlank(params.get('id'))) {
        this.loading = false;
        this.showErrorModal();
        return;
      }
      this.estimatedUsage = Number(params.get('usage')) || 0;
      this.getPlan(params.get('id') || '');
    });
  }

  private getPlan(id: string): void {
    this.api.get<PlanData>('/plans/' + id)
      .subscribe(data => {
          this.plan = data.data;
          this.breadcrumbs[1].title = `Postleitzahl: ${this.plan.postcode}`;
          this.breadcrumbs[1].routerLink = `/plans/${this.plan.postcode}`;
          this.breadcrumbs[2].title = `Tarif: ${this.plan.plan}`;
          this.breadcrumbs[2].routerLink = '';
          this.orderService.selectedPlan$.next(data.data);
          this.loading = false;
          this.loadingModalService.hideLoading();
        },
        error => {
          this.orderService.selectedPlan$.next(null);
          this.loading = false;
          this.loadingModalService.hideLoading();
          this.showErrorModal();
        }
      );
  }

  public setCurrentStep(value: number) {
    this.currentStep = value;
  }

  public showNextStep(): void {
    if (this.currentStep === 4) return;
    this.currentStep = this.currentStep + 1;
  }

  public showPreviousStep(): void {
    if (this.currentStep === 1) return;
    this.currentStep = this.currentStep - 1;
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
  }

  public showErrorModal(): void {
    this.modalService.showModal('Fehler', this.errorModal);
  }

  public order(): void {
    const planId = this.plan.id;
    const customerId = this.orderService.selectedCustomer$.value?.id || '';
    if (isBlank(planId) || isBlank(customerId)) {
      this.confirmService.confirm({
        title: `Es ist ein Fehler beim Kündigen aufgetreten.`,
        confirmButtonType: 'info',
        confirmText: 'Ok',
        showCancelButton: false
      });
      return;
    }

    this.api.post('/orders', {
      planId,
      customerId,
      consumption: this.estimatedUsage,
      referrer: 'Sonnenstrahl-Website'
    }).subscribe(data => {
      this.orderService.selectedCustomer$.next(null);
      this.router.navigate(['/order/success']);
    }, error => {
      this.confirmService.confirm({
        title: `Es ist ein Fehler aufgetreten.`,
        confirmButtonType: 'info',
        confirmText: 'Ok',
        description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
        showCancelButton: false
      });
    });
  }

  public showModal(name: 'login' | 'register' | 'selectCustomer' | 'createCustomer'): void {
    switch (name) {
    case 'login':
      this.modalService.showModal('Anmelden', this.loginModal);
      break;
    case 'register':
      this.modalService.showModal('Registrieren', this.registerModal);
      break;
    case 'createCustomer':
      this.modalService.showModal('Kunde erstellen', this.createCustomer);
      break;
    case 'selectCustomer':
      this.modalService.showModal('Kunde wählen', this.selectCustomer);
      break;
    }
  }

}
