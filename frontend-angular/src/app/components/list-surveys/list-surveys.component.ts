import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SurveyHeader } from 'src/app/common/survey-header';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-surveys',
    templateUrl: './list-surveys.component.html',
    styleUrls: ['./list-surveys.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSurveysComponent implements OnInit {

  surveyHeaders: SurveyHeader[] = [];
  constructor(private dbService: DbServiceService, private router: Router) { }

  ngOnInit(): void {
    this.listSurveys();
  }

  listSurveys(): void {
    this.dbService.getSurveyList().subscribe(
      (data: any) => {
        this.surveyHeaders = data;
      }
    );
  }

  deleteSurvey(id: any): void {
    this.dbService.deleteSurvey(id).subscribe();
    this.router.navigate(['login']);
  }

  copyToClipboard(id: any) {
    const item = 'localhost:4200/takeSurvey/' + id;
    const listener = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', item);
      }
      e.preventDefault();
      document.removeEventListener('copy', listener);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    alert("Link copied to clipboard");
  }

}
