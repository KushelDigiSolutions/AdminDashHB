import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CmsService } from '../../cms.service';

@Component({
  standalone: false,
  selector: 'app-add-metas',
  templateUrl: './add-metas.component.html',
  styleUrls: ['./add-metas.component.scss']
})
export class AddMetasComponent implements OnInit {

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
      metaTitle: "",
      metaDescription: "",
      name: "",
      metaTags: [[],this.formBuilder.array([])],
      tagsTemp: ""
    });

    this.route.params.subscribe(res=>{
      this.editId = res.id;
    });

   }

  ngOnInit(): void {

    if(this.editId){
      this.fetchMetaDetail();
    }

  }

  fetchMetaDetail(){
    this.cmsService.getMetaDetail(this.editId).subscribe((res:any)=>{

      let {data} = res;

      this.form.patchValue({
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        name: data.name,
        tagsTemp: data.metaTags.map(el=>el),
        metaTags: data.metaTags.map(el=>el)
      })
    })
  }

  addmeta(){
    let value = this.form.value;
    delete value.tagsTemp;
    if(this.editId){
      value._id = this.editId;
    }
    
    (this.editId?this.cmsService.updateMetaDetail(value):this.cmsService.addMeta(value))
    .subscribe((res:any)=>{
      this.toaster.success(res.message);
      this.router.navigate(["/metas"]);
    }, (err=>{
      this.toaster.error("Something went wrong");
    }))
  }

  fetchTags(value) {
    this.tempMetaTagArray.push(value);
    this.form.patchValue({
      tagsTemp: "",
      metaTags: this.tempMetaTagArray,
    });
  }

  removeMetaTag(index) {
    this.tempMetaTagArray.splice(index, 1);
  }

}
