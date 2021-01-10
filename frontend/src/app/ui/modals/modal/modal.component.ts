import {Component, Input} from '@angular/core';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title = '';
  @Input() blocking = false; // modal cannot be closed (e.g. loading)

  constructor(public modalService: ModalService) {
  }

  public closeModal(): void {
    if (!this.blocking)
      this.modalService.close();
  }

}
