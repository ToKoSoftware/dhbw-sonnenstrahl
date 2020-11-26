import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {filter, mergeMap, take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModalService implements OnDestroy {
  public elementRef: ElementRef | null = null;
  private escPressSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(private router: Router) {
    this.routerSubscription = this.router.events.subscribe(val => {
      this.close();
    });
    this.escPressSubscription = fromEvent(document.body, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'Escape' || event.key === 'Esc'),
    ).subscribe(() => this.close());
  }

  public ngOnDestroy(): void {
    this.close();
    this.routerSubscription?.unsubscribe();
    this.escPressSubscription?.unsubscribe();
  }

  public close(): void {

  }
}
