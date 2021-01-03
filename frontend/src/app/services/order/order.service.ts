import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CustomerData} from '../../interfaces/customer.interface';
import {PlanData} from '../../interfaces/plan.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public selectedCustomer$: BehaviorSubject<CustomerData | null> = new BehaviorSubject(null);
  public selectedPlan$: BehaviorSubject<PlanData | null> = new BehaviorSubject(null);

  constructor() { }
}
