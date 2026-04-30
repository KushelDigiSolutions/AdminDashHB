import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultantApiService } from '../consultant-api.service';

@Component({
  standalone: false,
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  breadCrumbItems = [
    { label: "Home" },
    { label: "Accounts", active: true },
  ];
  profileData: any;

  constructor(
    private api: ConsultantApiService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.fetchProfile();
    });
  }

  fetchProfile() {
    this.spinner.show();
    this.api.getProfile().subscribe((res: any) => {
      this.spinner.hide();
      setTimeout(() => {
        this.profileData = res.data;
        this.profileData.hbCommission = ((this.profileData.hbCommission / 100) * this.profileData.totalEarning);
        this.cdr.detectChanges();
      });
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    });
  }
}
