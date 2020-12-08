import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../services/modal/modal.service';
import isBlank from 'is-blank';
import {UiBreadcrumb} from '../../ui/ui.interface';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild('errorModal') errorModal: TemplateRef<unknown>;
  public plan: PlanData;
  public loading = false;
  private routeSubscription: Subscription;
  public estimatedUsage: number;
  public breadcrumbs: UiBreadcrumb[] = [
    {routerLink: '/', title: 'Home'},
    {routerLink: '', title: 'Laden...'},
    {routerLink: '', title: 'Laden...'},
  ];
  public customInputForm: FormGroup;
  public currentStep = 1;

  constructor(
    private formBuilder: FormBuilder,
    private readonly loadingModalService: LoadingModalService,
    private readonly modalService: ModalService,
    private apiService: ApiService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.customInputForm = this.formBuilder.group(
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
        agent: [''],
        phone: [{
          value: '0497 88 88 88',
          disabled: true
        }]
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
    this.apiService.get<PlanData>('/plans/' + id)
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
}
