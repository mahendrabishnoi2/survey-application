package com.mahendra.survey.response;

public class Headers {
  Long id;
  String surveyName;

  public Headers(Long id, String surveyName) {
    this.id = id;
    this.surveyName = surveyName;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getSurveyName() {
    return surveyName;
  }

  public void setSurveyName(String surveyName) {
    this.surveyName = surveyName;
  }

  @Override
  public String toString() {
    return "Headers{" + "id=" + id + ", surveyName='" + surveyName + '\'' + '}';
  }
}
