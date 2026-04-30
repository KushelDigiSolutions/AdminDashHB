import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceService } from './list.service';
import { InvoiceList } from './list.model';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';

@Component({
  standalone: false,
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  invoices$: Observable<InvoiceList[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: InvoiceService) {
    this.invoices$ = service.invoices$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadCrumbItems = [{ label: 'Invoices' }, { label: 'Invoice List', active: true }];
    });
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
