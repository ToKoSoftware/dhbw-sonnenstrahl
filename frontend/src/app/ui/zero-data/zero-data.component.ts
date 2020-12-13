import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-zero-data',
  templateUrl: './zero-data.component.html',
  styleUrls: ['./zero-data.component.scss']
})
export class ZeroDataComponent implements OnInit {
  @Input() image: AvailableZeroDataImages = 'empty';
  @Input() title = 'Keine Daten vorhanden';
  @Input() description = '';
  constructor() { }

  ngOnInit(): void {
  }

}
export type AvailableZeroDataImages = 'empty';