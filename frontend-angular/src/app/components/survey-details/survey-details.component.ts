import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Respondant } from 'src/app/common/respondant';
import { SurveyFull } from 'src/app/common/survey-full';
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
import { Response } from 'src/app/common/response';

@Component({
    selector: 'app-survey-details',
    templateUrl: './survey-details.component.html',
    styleUrls: ['./survey-details.component.css'],
    standalone: false
})
export class SurveyDetailsComponent implements OnInit, AfterViewInit {

  private chartsReady = false;
  private viewReady = false;

  surveyId!: number;
  respondents: Respondant[] = [];
  initailRespondents: Respondant[] = [];
  surveyDetails!: SurveyFull;
  filterStart!: string;
  filterEnd!: string;
  responses: Response[] = [];

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  // for google charts library 
  columnNames: string[] = ["Number of Questions", "Number of Responses"];
  options = {
    title: 'Survey Details'
  };
  type = "BarChart";
  data: any[] = [];

  constructor(private route: ActivatedRoute, private dbService: DbServiceService,
    private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.surveyId = idParam ? +idParam : 0;
    this.loadGoogleCharts();
    this.getSurveyDetails();
    this.getSurveyResponses();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.chartsReady && this.data.length > 0) {
      this.renderChart();
    }
  }

  getSurveyResponses() {
    this.dbService.getSurveyResponses(this.surveyId).subscribe(
      (data: any) => {
        this.responses = data;
      }
    );
  }

  getSurveyDetails() {
    forkJoin({
      respondents: this.dbService.getSurveyRespondents(this.surveyId),
      survey: this.dbService.getSurvey(this.surveyId)
    }).subscribe(({ respondents, survey }) => {
      this.respondents = respondents;
      this.initailRespondents = respondents;
      this.surveyDetails = survey;
      this.filterStart = survey.created.toString().split('T')[0];
      this.filterEnd = survey.validTill.toString().split('T')[0];
      this.data = [
        ["Questions", survey.questions.length],
        ["Responses", respondents?.length || 0]
      ];
      this.drawChart();
    });
  }

  private loadGoogleCharts(): void {
    if ((window as any).google?.charts) {
      this.chartsReady = true;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.type = 'text/javascript';
    script.onload = () => {
      const g = (window as any).google;
      g.charts.load('current', { packages: ['corechart'] });
      g.charts.setOnLoadCallback(() => {
        this.chartsReady = true;
        if (this.viewReady && this.data.length > 0) {
          this.renderChart();
        }
      });
    };
    document.head.appendChild(script);
  }

  drawChart(): void {
    if (this.chartsReady && this.viewReady) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    const g = (window as any).google;
    const dataTable = g.visualization.arrayToDataTable([
      ['Metric', 'Count'],
      ...this.data
    ]);
    const chart = new g.visualization.BarChart(this.chartContainer.nativeElement);
    chart.draw(dataTable, this.options);
  }

  filterByDate() {
    const updatedRespondents: Respondant[] = [];

    const filterStartDate = new Date(this.filterStart);
    const filterEndDate = new Date(this.filterEnd);

    this.initailRespondents.forEach(
      respondent => {
        let toAdd = false;
        const tempDate = new Date(respondent.takenOn.toString().split('T')[0]);
        if (tempDate.getTime() >= filterStartDate.getTime() && tempDate.getTime() <= filterEndDate.getTime()) toAdd = true;
        if (toAdd) updatedRespondents.push(respondent);
      }
    )
    this.respondents = updatedRespondents;
  }

  // create json object for survey details
  getJsonDetails() {
    const detailsJson = [{
      "Survey Name": this.surveyDetails?.name,
      "Survey Description": this.surveyDetails?.description,
      "Number of Questions": this.surveyDetails?.questions.length,
      "Number of Responses": this.respondents?.length,
      "Created On": this.surveyDetails?.created,
      "Valid Till": this.surveyDetails?.validTill
    }];
    return detailsJson;
  }

  // create json object for respondents to survey
  getJsonRespondents() {
    const respondentsJson: any[] = [];
    this.respondents.forEach(
      respondent => {
        respondentsJson.push({
          "Name": respondent.fullName,
          "Email": respondent.email,
          "Submission Date": respondent.takenOn
        })
      }
    )
    return respondentsJson;
  }

  getJsonResponses() {
    const responsesJson: any[] = [];
    this.responses?.forEach(
      response => {
        responsesJson.push({
          "Name": response.fullName,
          "Email": response.email,
        });
        for (let i = 0; i < response.questions.length; i++) {
          const ques = response.questions[i];
          const ans = response.answers[i];
          responsesJson[responsesJson.length - 1][ques] = ans;
        }
      }
    );
    return responsesJson;
  }

  // download data in json format
  downloadJson(field: string) {
    const jsonData = this.getJsonData(field);
    const blob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
    const fileName = `${field}.json`;
    saveAs(blob, fileName);
  }

  // get json data by calling appropriate method based on value of field
  private getJsonData(field: string) {
    let jsonData;
    if (field === "details") {
      jsonData = this.getJsonDetails();
    } else if (field === "respondents") {
      jsonData = this.getJsonRespondents();
    } else {
      jsonData = this.getJsonResponses();
    }
    return jsonData;
  }

  // create an xlsx workbook with an sheet
  private createXlsxWorkbook(field: string) {
    const wb = XLSX.utils.book_new();
    wb.SheetNames.push(field);
    const jsonData = this.getJsonData(field);
    const ws = XLSX.utils.json_to_sheet(jsonData);
    wb.Sheets[field] = ws;
    return wb;
  }

  // download data in excel format
  downloadXlsx(field: string) {
    const wb = this.createXlsxWorkbook(field);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), `${field}.xlsx`);
  }

  downloadCsv(field: string) {
    const ws = this.createXlsxWorkbook(field).Sheets[field];
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `${field}.csv`);
  }

  // convert into octet stream for saving into xlsx format
  private s2ab(s: string) {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  redirect(): void {
    this.router.navigate(['login']);
  }

}
