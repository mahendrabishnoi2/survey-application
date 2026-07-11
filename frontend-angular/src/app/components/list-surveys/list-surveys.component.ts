import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SurveyHeader } from 'src/app/common/survey-header';
import { DbServiceService } from 'src/app/services/db-service.service';

@Component({
    selector: 'app-list-surveys',
    templateUrl: './list-surveys.component.html',
    styleUrls: ['./list-surveys.component.css'],
    standalone: false
})
export class ListSurveysComponent implements OnInit {

  surveyHeaders: SurveyHeader[] = [];
  constructor(private dbService: DbServiceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listSurveys();
  }

  listSurveys(): void {
    this.dbService.getSurveyList().subscribe(
      (data: any) => {
        this.surveyHeaders = data;
        this.cdr.detectChanges();
      }
    );
  }

  deleteSurvey(id: any): void {
    this.dbService.deleteSurvey(id).subscribe(() => this.listSurveys());
  }

  copyToClipboard(id: any) {
    const item = `${window.location.origin}/#/takeSurvey/${id}`;
    navigator.clipboard.writeText(item).then(() => alert("Link copied to clipboard"));
  }

}
