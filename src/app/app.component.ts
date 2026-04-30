import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
  ) { }

  ngOnInit() {
    //  document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");  
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.spinner.hide();
      }
    })
  }

}
