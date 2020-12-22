import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CustomerData} from '../../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public selectedCustomer$: BehaviorSubject<CustomerData | null> = new BehaviorSubject(null);

  constructor() { }
}
