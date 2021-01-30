import {Component, Input} from '@angular/core';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Input() title = '';
  @Input() blocking = false; // Modal cannot be closed (e.g. loading)

  constructor(public modalService: ModalService) {
  }

  /**
   * Closes modal, if user is allowed to
   */
  public closeModal(): void {
    if (!this.blocking)
      this.modalService.close();
  }

}
