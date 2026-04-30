import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})

/**
 * UI-colors component
 */
export class ColorsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'UI Elements' }, { label: 'Colors', active: true }];
  }
}
