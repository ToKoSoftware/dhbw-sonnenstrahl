import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UiButton, UiButtonGroup} from '../ui.interface';
import {Subject, Subscription} from 'rxjs';
import {ConfirmModalService} from '../../admin/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() description = '';
  @Input() confirmAction: () => void;
  @Input() cancelAction: () => void;
  public showModal = false;
  private showModalSubscription: Subscription;


  public confirmButton: UiButton = {
    icon: 'trash',
    title: 'Löschen'
  };

  constructor(private confirmService: ConfirmModalService) {
  }

  ngOnInit(): void {
    this.showModalSubscription = this.confirmService.showModal$.subscribe(
      val => this.showModal = val
    );
  }

  ngOnDestroy(): void {
    this.showModalSubscription.unsubscribe();
  }

  public runConfirmAction(): void {
    this.confirmService.showModal$.next(false);
    this.confirmService.clickEvent$.next(true);
  }

  public runCancelAction(): void {
    this.confirmService.showModal$.next(false);
    this.confirmService.clickEvent$.next(false);
  }


}

export interface ConfirmModalConfig{
  title: string;
}
