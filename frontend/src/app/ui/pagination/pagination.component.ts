import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() limitAndOffset: LimitAndOffset = {
    limit: 25,
    offset: 0
  };
  @Output() limitAndOffsetEvent = new EventEmitter<LimitAndOffset>();

  /**
   * Change page from given offset count
   * 
   * @param {number} offset
   */
  changePage(offset: number): void {
    this.limitAndOffset.offset = offset;
    this.limitAndOffsetEvent.emit(this.limitAndOffset);
  }

  /**
   * Change the limitation of a page
   * 
   * @param {number} count
   */
  changeLimit(count: number): void {
    this.limitAndOffset.limit = count;
    this.limitAndOffset.offset = 0;
    this.limitAndOffsetEvent.emit(this.limitAndOffset);
  }

}

export interface LimitAndOffset {
  limit: number;
  offset: number;
}
