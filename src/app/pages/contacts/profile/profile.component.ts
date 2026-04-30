import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { getUserRoles } from "src/app/util/user-role.util";
import { ContactsService } from "../contacts.service";
import { revenueBarChart, statData } from "./data";
import { ChartType } from "./profile.model";

@Component({
  standalone: false,
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  revenueBarChart: ChartType;
  statData;
  userId: string;
  userDetails;
  form: FormGroup;

  userRoles = [];

  constructor(
    private contactService: ContactsService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.route.params.subscribe((res) => {
      this.userId = res.id;
    });

    this.form = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: "",
      phone: ["", Validators.required],
      email: [""],
      DOB: "",
      gender: "",
      role: [["User"], Validators.required],
      description: "",
      _id: ""
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadCrumbItems = [
        { label: "Contacts" },
        { label: "Profile", active: true },
      ];
      this.userRoles = getUserRoles();
      if (this.userId) {
        this.fetchUserDetail();
      }
      this.cdr.detectChanges();
    });
  }

  fetchUserDetail() {
    this.spinner.show();
    this.contactService
      .getUserDetail(this.userId)
      .subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.spinner.hide();
            this.userDetails = res.data;
            this.form.patchValue({
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              phone: res.data.phone,
              email: res.data.email,
              DOB: res.data.DOB,
              gender: res.data.gender,
              role: res.data.role,
              description: res.data.description,
              _id: res.data._id
            });
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toaster.error(err.error?.message || "Failed to load user details");
        }
      });
  }

  onSubmit(): void {
    let { value, invalid } = this.form;
    if (invalid) { this.toaster.error('Please fill required fields'); return; }

    this.spinner.show();
    if (!this.userId) {
      const payload = { ...value };
      delete payload._id;

      this.contactService.createUser(payload).subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.spinner.hide();
            if (res.success) {
              this.toaster.success("User created successfully");
              this.router.navigateByUrl('/contacts/list');
            }
            this.cdr.detectChanges();
          });
        },
        error: (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toaster.error(err.error?.message || 'Something went wrong');
        }
      });
    } else {
      this.contactService.updateUserProfile(value)
        .subscribe({
          next: (res: any) => {
            setTimeout(() => {
              this.spinner.hide();
              if (res.success) {
                this.toaster.success("Profile Updated");
                this.fetchUserDetail();
              }
              this.cdr.detectChanges();
            });
          },
          error: (err: HttpErrorResponse) => {
            this.spinner.hide();
            this.toaster.error(err.error?.message || 'Something went wrong');
          }
        });
    }

  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }
}
