import { Injectable } from '@angular/core';
import { ApiService, RequestHttpParams } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {

  constructor(
    private api: ApiService,
  ) { }

  getSurveyResponseList(id: string) {
    return this.api.get<{ success: boolean, message: string, data: any[] }>('survey/surveyByAssessmentId/' + id)
  }

  getSurveyResponse(id: string){
    return this.api.get<{ success: boolean, message: string, data: any[] }>('survey/' + id)
  }

  getAssessmentsList(queryParams?: RequestHttpParams) {
    return this.api.get<{ total: number, success: boolean, data: any[] }>('assessments', queryParams)
  }

  getAssessment(id: string) {
    return this.api.get<{ total: number, success: boolean, data: any[] }>('assessments/' + id)
  }

  createAssessment(data: any) {
    return this.api.post('assessments', data)
  }

  updateAssessment(_id: string, data: any) {
    return this.api.put('assessments/' + _id, data)
  }

  deleteAssessment(_id: string) {
    return this.api.delete<{ success: boolean, message: string }>('assessments/' + _id)
  }
  // ===============

  getInstructions(queryParams?: RequestHttpParams) {
    return this.api.get<{ total: number, success: boolean, data: any[] }>('instructions', queryParams)
  }

  createInstructions(data: any) {
    return this.api.post('instructions', data)
  }

  updateInstructions(data: any) {
    return this.api.put('instructions', data)
  }

  deleteInstructions(_id: string) {
    return this.api.delete('instructions/' + _id)
  }
  // ===============


  getQuestions(params?: RequestHttpParams) {
    return this.api.get<{ total: number, success: boolean, data: any[] }>('questions', params)
  }

  createQuestions(data: any) {
    return this.api.post('questions', data)
  }

  updateQuestions(data: any) {
    return this.api.put('questions', data)
  }

  deleteQuestion(_id: string) {
    return this.api.delete('questions/' + _id)
  }

}
