import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Usergrid } from './usergrid.model';

import { userGridData } from './data';

@Component({
  standalone: false,
  selector: 'app-usergrid',
  templateUrl: './usergrid.component.html',
  styleUrls: ['./usergrid.component.scss']
})

/**
 * Contacts user grid component
 */
export class UsergridComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  userGridData: Usergrid[];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
        this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Users Grid', active: true }];

        /**
         * fetches data
         */
        this._fetchData();
        this.cdr.detectChanges();
    });
  }

  /**
   * User grid data fetches
   */
  private _fetchData() {
    this.userGridData = userGridData;
  }
}
