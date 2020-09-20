import { Component, OnInit } from '@angular/core';
import { SurveyHeader } from 'src/app/common/survey-header';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver/src/FileSaver';

@Component({
  selector: 'app-list-surveys',
  templateUrl: './list-surveys.component.html',
  styleUrls: ['./list-surveys.component.css']
})
export class ListSurveysComponent implements OnInit {

  surveyHeaders: SurveyHeader[];
  constructor(private dbService: DbServiceService, private router: Router) { }

  ngOnInit(): void {
    this.listSurveys();
  }

  listSurveys(): void {
    this.dbService.getSurveyList().subscribe(
      data => {
        this.surveyHeaders = data;
      }
    );
  }

  deleteSurvey(id: any): void {
    this.dbService.deleteSurvey(id).subscribe();
    this.router.navigate(['login']);
  }

  copyToClipboard(id) {
    let item = 'localhost:4200/takeSurvey/' + id;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    alert("Link copied to clipboard");
  }

}
