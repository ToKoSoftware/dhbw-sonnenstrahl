import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UiButton, UiButtonGroup} from '../../ui.interface';
import {Subject, Subscription} from 'rxjs';
import {ConfirmModalService} from '../../../services/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  public showModal = false;
  private showModalSubscription: Subscription;
  public config: ConfirmModalConfig;

  constructor(private confirmService: ConfirmModalService) {
  }

  ngOnInit(): void {
    this.setDefaultValues();
    this.showModalSubscription = this.confirmService.showModal$.subscribe(
      val => {
        this.showModal = val;
        const config = this.confirmService.getConfig;
        this.config = {...this.config, ...config};
      }
    );
  }

  ngOnDestroy(): void {
    this.showModalSubscription.unsubscribe();
  }

  public runConfirmAction(): void {
    this.confirmService.showModal$.next(false);
    this.confirmService.clickEvent$.next(true);
    this.setDefaultValues();
  }

  public runCancelAction(): void {
    this.confirmService.showModal$.next(false);
    this.confirmService.clickEvent$.next(false);
    this.setDefaultValues();
  }

  private setDefaultValues(): void {
    this.config = {
      title: 'Aktion bestätigen',
      description: '',
      confirmText: 'Bestätigen',
      cancelText: 'Abbrechen',
    };
  }

}

export interface ConfirmModalConfig {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}
