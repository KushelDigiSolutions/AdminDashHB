import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface IBreadcrumbItem {
  label: string,
  active?: boolean,
  path?: string
}

export interface IBreadcrumbItems extends Array<IBreadcrumbItem> { }

@Component({
  standalone: true,
  selector: 'app-page-title',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class PagetitleComponent implements OnInit {

  @Input() breadcrumbItems: IBreadcrumbItems;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
