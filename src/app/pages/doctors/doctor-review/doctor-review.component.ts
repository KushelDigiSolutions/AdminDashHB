import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DoctorsService } from "../doctors.service";

@Component({
  standalone: false,
  selector: "app-doctor-review",
  templateUrl: "./doctor-review.component.html",
  styleUrls: ["./doctor-review.component.scss"],
})
export class DoctorReviewComponent implements OnInit {
  consultantId;

  chatMessagesData: Array<{}>;
  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorsService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    console.log("consultant ID", this.consultantId);
    this.route.params.subscribe((res: any) => {
      this.consultantId = res.id;
    });
  }

  ngOnInit(): void {
    console.log("here");
    setTimeout(() => {
      this.doctorService.getDoctorReviews(this.consultantId).subscribe(
        (res: any) => {
          setTimeout(() => {
            this.chatMessagesData = res.data;
            console.log("Chat ", this.chatMessagesData);
            this.cdr.detectChanges();
          });
        },
        (err: HttpErrorResponse) => {
          console.log("err", err);
        }
      );
    });
  }

  approveClicked(data) {
    let body = {
      _id: data._id,
      verified: !data.verified,
      publish: !data.publish,
    };
    this.doctorService.verifyAndPublishReview(body)
    .subscribe((res: any) => {
      this.toaster.success(res.message);
      setTimeout(() => { this.cdr.detectChanges(); });
    }, (err: any) => {
      console.log("err", err)
    })
  }
}
