import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { ContactsService } from 'src/app/pages/contacts/contacts.service';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';
import { trimInputValue } from 'src/app/util/input.util';
import { AssessmentsService } from '../assessments.service';


@Component({
  standalone: false,
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss']
})
export class AddAssessmentComponent implements OnInit {

  breadcrumb = [
    { label: "Corporate" },
    { label: "Create Package", active: true },
  ];
  activeTab = 1;
  editId: string;
  oldData: any;
  submitted = false;
  instSubmitted = false;
  quesSubmitted = false;

  durations = [
    { months: 1, label: "1 Month" },
    { months: 3, label: "3 Month" },
    { months: 6, label: "6 Month" },
    { months: 12, label: "1 Year" },
  ]

  form = this.fb.group({
    name: ["", Validators.required],
    time_limit: ["", Validators.required],
    image: [[]],
    isActive: true,
  });
  instructionsForm = this.fb.group({
    instructions: this.fb.array([]),
  });
  questionsForm = this.fb.group({
    questions: this.fb.array([]),
  });
  surveyResponse = [];

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private assessmentService: AssessmentsService,
    private contactsService: ContactsService,
    private eCommerceService: EcommerceService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    this.activeTab = parseInt(this.route.snapshot.queryParams.view || 1);

    if (this.editId) {
      this.getDetails();
      this.getInstructions();
      this.getQuestions();
      this.getSurveyResponse();
    }
  }

  get f() {
    return this.form.controls
  }

  get iForm() {
    return this.instructionsForm.controls
  }

  get qForm() {
    return this.questionsForm.controls
  }

  get instructionsFA() {
    return <FormArray>this.instructionsForm.get('instructions')
  }

  get questionsFA() {
    return <FormArray>this.questionsForm.get('questions')
  }

  answerFA(control) {
    return <FormArray>control.get('answer')
  }

  onSubmit() {
    this.submitted = true;
    let { valid, value } = this.form;
    console.log(value);
    this.submitted = true;
    if (valid) {
      this.spinner.show();

      this.fileUploadService.smartFileUpload(value.image).subscribe(res => {
        let payload = { ...value };
        delete (payload as any).image;

        if (res.success && res.data[0]) {
          (payload as any).image = res.data[0];
        }
        let req = this.assessmentService.createAssessment(payload);
        if (this.editId) {
          req = this.assessmentService.updateAssessment(this.editId, payload);
        }

        req.subscribe((res: any) => {
          this.spinner.hide();
          if (!this.editId) {
            this.oldData = res.data;
            this.editId = res.data._id;
          }
          this.toastr.success(this.editId ? 'Assessment updated' : 'Assessment created successfully');

        }, (err: HttpErrorResponse) => {
          this.spinner.hide();
        });

      }, (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.toaster.error('Issue in file uploading')
      });
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  onSubmitInstructions() {
    this.instSubmitted = true
    let { invalid, value } = this.instructionsForm as any
    console.log(invalid, value);
    if (invalid) return;
    this.spinner.show();
    let data = {
      assessment_id: this.editId,
      instructions: value.instructions.map(el => {
        el = { ...el }
        if (!el._id) delete el._id;

        return {
          ...el,
          bullet: true
        }
      })
    }
    this.assessmentService.updateInstructions(data).subscribe(res => {
      this.spinner.hide();
      this.toaster.success('Instructions Updated Successfully');
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    })
  }

  onSubmitQuestions() {
    this.quesSubmitted = true
    let { invalid, value } = this.questionsForm as any
    console.log(invalid, value);
    if (invalid) return;
    this.spinner.show();
    let data = {
      assessment_id: this.editId,
      questions: value.questions.map((el, i) => {
        el = { ...el }
        let typeKey = 'type_' + i;
        el.type = el[typeKey]
        delete el[typeKey]
        if (!el._id) delete el._id;

        return el
      })
    }
    this.assessmentService.updateQuestions(data).subscribe(res => {
      this.spinner.hide();
      this.toaster.success('Questions Updated Successfully')
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
    })
  }

  getDetails() {
    this.spinner.show();
    this.assessmentService.getAssessment(this.editId).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.data) this.goBackToList();
      this.oldData = res.data;
      let { name, time_limit, image, active } = this.oldData;
      let patchData: any = {
        name: name,
        time_limit: time_limit || "",
        image: image ? [image] : [],
        isActive: active !== undefined ? active : true,
      };
      this.form.patchValue(patchData);
    }, (err: HttpErrorResponse) => {
      this.spinner.hide();
      this.goBackToList()
    })
  }

  getInstructions() {
    let params = {
      assessmentId: this.editId
    }
    this.assessmentService.getInstructions(params).subscribe(res => {
      res.data.forEach(el => {
        this.addInstruction(el._id, el.instruction)
      });
    }, (err: HttpErrorResponse) => {

    })
  }

  getQuestions() {
    let params = {
      assessmentId: this.editId
    }
    this.assessmentService.getQuestions(params).subscribe(res => {
      let { success, data } = res
      if (success) {
        data.forEach(el => {
          let { _id, question, type, answer } = el;
          let answers = answer.map(ans => {
            let { title, category } = ans
            return this.createAnswerGroup(title, category)
          })
          this.addQuestionGroup(_id, question, type, answers)
        })
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  getSurveyResponse() {
    this.assessmentService.getSurveyResponseList(this.editId).subscribe(res => {
      let { success, data } = res
      if (success) this.surveyResponse = data;
      
    }, (err: HttpErrorResponse) => {

    })
  }

  addInstruction(_id = '', instruction = '') {
    this.instructionsFA.push(this.fb.group({
      _id,
      instruction: [instruction, Validators.required]
    }))
  }

  removeInstruction(i: number) {
    let formGroup = this.instructionsFA.at(i)
    let { _id, instruction } = formGroup.value
    if (_id) {
      if (confirm(`Are you sure you want to delete "${instruction}" instruction?`)) {
        this.spinner.show()
        this.assessmentService.deleteInstructions(_id).subscribe(res => {
          this.spinner.hide()
          this.instructionsFA.removeAt(i)
          this.toaster.success('Instruction Deleted Successfully')
        }, (err: HttpErrorResponse) => {
          this.spinner.hide()

        })
      }
    } else {
      this.instructionsFA.removeAt(i)

    }
  }

  createQuestionGroup(_id = '', question = '', type = 'single', answer = []) {
    let { length } = this.questionsFA
    let group: any = {
      _id,
      question: [question, [Validators.required]],
      answer: this.fb.array(answer)
    };
    group['type_' + length] = [type];
    return this.fb.group(group)
  }

  addQuestionGroup(_id = '', question = '', type = undefined, answer = [this.createAnswerGroup()]) {
    this.questionsFA.push(this.createQuestionGroup(_id, question, type, answer))
  }

  removeQuestionGroup(i: number) {
    let formGroup = <FormGroup>this.questionsFA.at(i);
    let { _id, question } = formGroup.value
    if (_id) {
      if (confirm(`Are you sure you want to delete "${question}" question?`)) {
        this.spinner.show()
        this.assessmentService.deleteQuestion(_id).subscribe(res => {
          this.spinner.hide()
          this.questionsFA.removeAt(i)
          this.toaster.success('Question Deleted Successfully')
        }, (err: HttpErrorResponse) => {
          this.spinner.hide()
          this.toaster.error(err.error?.message || 'Something went wrong')
        })
      }
    } else {
      this.questionsFA.removeAt(i)
    }
  }

  createAnswerGroup(title: string = '', category: string = '') {
    return this.fb.group({
      title: [title, [Validators.required]],
      category
    })
  }

  addAnswerGroup(control) {
    let fa = this.answerFA(control)
    fa.push(this.createAnswerGroup())
  }

  removeAnswerGroup(control, i: number) {
    let fa = this.answerFA(control)
    fa.removeAt(i)
  }

  trimValue(input) {
    trimInputValue(input)
  }

  goBackToList() {
    this.router.navigateByUrl('/assessments');
  }

}
