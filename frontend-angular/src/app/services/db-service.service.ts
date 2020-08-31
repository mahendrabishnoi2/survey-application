import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SurveyHeader } from '../common/survey-header';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Questions } from '../common/questions';
import { InputTypes } from '../common/input-types';
import { QuestionsOptions } from '../common/questions-options';
import { SurveyFull } from '../common/survey-full';
import { SurveyResponse } from '../common/survey-response';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  baseUrl: string = "http://localhost:8080/api/";

  constructor(private httpClient: HttpClient) { }

  verifyUser(id: number, user: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}respondant/new/${id}`, user);
  }

  getSurveyList(): Observable<SurveyHeader[]> {
    return this.httpClient.get<GetResponseSurveyList>(`${this.baseUrl}surveys`).pipe(
      map(response => response._embedded.surveyHeader)
    );
  }

  getSurvey(id: number): Observable<SurveyFull> {
    return this.httpClient.get<SurveyFull>(`${this.baseUrl}/surveys/${id}`);
  }

  getSurveyHeaderById(id: number): Observable<SurveyHeader> {
    return this.httpClient.get<SurveyHeader>(`${this.baseUrl}surveys/${id}`)
    // .pipe(map(response => response.surveyHeader))
    ;
  }

  getQuestions(id: number): Observable<Questions[]> {
    return this.httpClient.get<GetQuestionsList>(`${this.baseUrl}surveys/${id}/questions`).pipe(
      map(response => response._embedded.questions)
    );
  }

  // get input type of given question 
  // getInputType(id: number): Observable<InputTypes> {
  //   return this.httpClient.get<InputTypes>(`${this.baseUrl}questions/${id}/inputTypeId`)
  //   // .pipe(map(response => response._embedded.inputTypes))
  //   ;
  // }

  // get options of a given question id
  getQuestionsOptions(id: number): Observable<QuestionsOptions[]> {
    return this.httpClient.get<GetQuestionsOptionsList>(`${this.baseUrl}questions/${id}/questionsOptions`).pipe(
      map(response => response._embedded.questionsOptions)
    );
  }

  saveSurveyResponse(surveyResponse: SurveyResponse): Observable<any> {
    const url = `${this.baseUrl}/surveys/response`;
    return this.httpClient.post(url, surveyResponse);
  }
}

interface GetResponseSurveyList {
  _embedded: {
    surveyHeader: SurveyHeader[];
  }
}

// interface GetResponseSurveyHeader {
//   surveyHeader: SurveyHeader;
// }

interface GetQuestionsList {
  _embedded: {
    questions: Questions[];
  }
}

// interface GetInputType {
//   inputTypes: InputTypes;
// }

interface GetQuestionsOptionsList {
  _embedded: {
    questionsOptions: QuestionsOptions[];
  }
}