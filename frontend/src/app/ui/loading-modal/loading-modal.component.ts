import { Component, OnInit } from '@angular/core';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent implements OnInit {

  constructor(public loadingModalService: LoadingModalService) { }

  ngOnInit(): void {
  }

}
