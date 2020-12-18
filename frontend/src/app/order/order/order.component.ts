import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PlanData} from '../../interfaces/plan.interface';
import {Subscription} from 'rxjs';
import {UiBreadcrumb} from '../../ui/ui.interface';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import isBlank from 'is-blank';
import {LoginService} from '../../services/login/login.service';
import {OrderService} from '../../services/order/order.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';

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
  public plan: PlanData;
  public loading = false;
  private routeSubscription: Subscription;
  public estimatedUsage: number;
  public breadcrumbs: UiBreadcrumb[] = [
    {routerLink: '/', title: 'Home'},
    {routerLink: '', title: 'Laden...'},
    {routerLink: '', title: 'Laden...'},
  ];
  public orderForm: FormGroup;
  public currentStep = 1;

  constructor(
    public readonly loginService: LoginService,
    public readonly orderService: OrderService,
    private readonly formBuilder: FormBuilder,
    private readonly confirmService: ConfirmModalService,
    private readonly loadingModalService: LoadingModalService,
    private readonly modalService: ModalService,
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group(
      {
        email: [''],
        firstName: [''],
        lastName: [''],
        street: [''],
        streetNumber: [''],
        zipCode: [''],
        city: [''],
        rateId: [''],
        consumption: ['8'],
        agent: ['Moonshine-Frontend'],
      }
    );
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
      this.orderForm.controls['consumption'].setValue(this.estimatedUsage);
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
          this.loading = false;
          this.loadingModalService.hideLoading();
        },
        error => {
          this.loading = false;
          this.loadingModalService.hideLoading();
          this.showErrorModal();
        }
      );
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

  public showModal(name: 'login' | 'register' | 'selectCustomer'): void {
    switch (name) {
    case 'login':
      this.modalService.showModal('Anmelden', this.loginModal);
      break;
    case 'register':
      this.modalService.showModal('Registrieren', this.registerModal);
      break;
    case 'selectCustomer':
      this.modalService.showModal('Kunde wählen', this.selectCustomer);
      break;
    }
  }

}
