import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CmsService } from '../../cms.service';

@Component({
  standalone: false,
  selector: 'app-add-settings',
  templateUrl: './add-settings.component.html',
  styleUrls: ['./add-settings.component.scss']
})
export class AddSettingsComponent implements OnInit {
  editId:string;
  form: FormGroup;

  tempMetaTagArray = [];
  types;
  constructor(
    private formBuilder: FormBuilder,
    private cmsService: CmsService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      thirdParty: ["",[Validators.required]],
      hbCommission: ["",[Validators.required]],
      title: ["",[Validators.required]],
      thirdPartyCommission: ["",[Validators.required]]
    });

    this.route.params.subscribe(res=>{
      this.editId = res.id;
    });

   }

  ngOnInit(): void {

    if(this.editId){
      this.getSettingDetail();
    }

  }

  getSettingDetail(){
    this.cmsService.getSettingDetail(this.editId).subscribe((res:any)=>{
      let {data} = res;

      this.form.patchValue({
        thirdParty: data.thirdParty,
        hbCommission: data.hbCommission,
        title: data.title,
        thirdPartyCommission: data.thirdPartyCommission
      })

    }, (err:HttpErrorResponse)=>{})
  }

  addSetting(){
    let value = this.form.value;
    if(this.editId){
      value._id = this.editId;
    }    
    (this.editId?this.cmsService.updateSetting(value):this.cmsService.addSetting(value))
    .subscribe((res:any)=>{
      this.toaster.success(res.message);
      this.router.navigate(["/settings"]);
    }, (err=>{
      this.toaster.error("Something went wrong");
    }))
  }
}