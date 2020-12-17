import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PlanData} from '../../interfaces/plan.interface';
import {Subscription} from 'rxjs';
import {UiBreadcrumb} from '../../ui/ui.interface';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute} from '@angular/router';
import isBlank from 'is-blank';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  @ViewChild('errorModal') errorModal: TemplateRef<unknown>;
  @ViewChild('loginModal') loginModal: TemplateRef<unknown>;
  @ViewChild('registerModal') registerModal: TemplateRef<unknown>;
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
    private formBuilder: FormBuilder,
    private readonly loadingModalService: LoadingModalService,
    private readonly modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute) {
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
        consumption: [''],
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
    if (this.currentStep === 3) return;
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
    this.api.post('/orders', {
      ...this.orderForm.value,

    }).subscribe();
  }

  public showModal(name: 'login' | 'register'): void {
    switch (name) {
    case 'login':
      this.modalService.showModal('Anmelden', this.loginModal);
      break;
    case 'register':
      this.modalService.showModal('Registrieren', this.registerModal);
      break;
    }
  }

}
