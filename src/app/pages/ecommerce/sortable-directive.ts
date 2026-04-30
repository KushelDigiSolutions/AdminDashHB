import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from './orders/transaction';

export type SortColumn = keyof Transaction | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  standalone: true,
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
      console.log("Inside sortable directive");
      console.log("SORTABLE",this.sortable);
      console.log("Direction",this.direction);
    this.direction = rotate[this.direction];
    console.log("direction",this.direction);
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}