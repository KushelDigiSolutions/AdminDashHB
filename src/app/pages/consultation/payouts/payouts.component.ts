import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { NgbdSortableHeader } from '../../ecommerce/sortable-directive';

@Component({
  standalone: false,
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.scss']
})
export class PayoutsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  term: any;
  hideme: boolean[] = [];
  listData: any[] = [
    {
      payoutId:'PT05',
      name: 'Richard Wilson',
      email: 'richard_wilson@gmail.com',
      amount: '10500',
      date: "2021-08-10T11:07:13.198Z"
    },
    {
      payoutId:'PT06',
      name: 'Vena',
      email: 'vena@gmail.com',
      amount: '9500',
      date: "2021-08-10T11:07:13.198Z"
    },
    {
      payoutId:'PT07',
      name: 'Christopher',
      email: 'christopher@gmail.com',
      amount: '15000',
      date: "2021-08-10T11:07:13.198Z"
    },
  ];

  selectedDate: any;
  page = 1;
  pageSize = 10;
  total = 0;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.breadCrumbItems = [
        { label: 'Payouts' },
        { label: 'List', active: true },
      ];
      this.selectedDate = new Date().getDate();
      this.cdr.detectChanges();
    });
  }
}
