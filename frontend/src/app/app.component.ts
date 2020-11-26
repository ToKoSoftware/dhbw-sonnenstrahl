import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalService} from './services/modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(ElementRef) private modalTarget: ElementRef;

  constructor(
    private readonly modalService: ModalService,
  ) {
  }

  ngOnInit(): void {
    this.modalService.elementRef = this.modalTarget;
  }


}
