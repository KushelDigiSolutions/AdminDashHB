import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})

/**
 * Maintenance page component
 */
export class MaintenanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.body.setAttribute('class', 'authentication-bg');
  }

}
