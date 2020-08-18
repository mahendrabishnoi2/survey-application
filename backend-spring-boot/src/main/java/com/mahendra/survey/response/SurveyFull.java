package com.mahendra.survey.response;

import java.util.List;

public class SurveyFull {
  long id;
  String name;
  List<Question> questions;

  public SurveyFull() {}

  public SurveyFull(long id, String name,
      List<Question> questions) {
    this.id = id;
    this.name = name;
    this.questions = questions;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Question> getQuestions() {
    return questions;
  }

  public void setQuestions(List<Question> questions) {
    this.questions = questions;
  }
}
