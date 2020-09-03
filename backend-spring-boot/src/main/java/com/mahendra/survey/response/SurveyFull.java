package com.mahendra.survey.response;

import java.util.Date;
import java.util.List;

public class SurveyFull {
  long id;
  String name;
  List<Question> questions;
  Date created;
  Date validTill;
  String description;

  public SurveyFull() {}

  public SurveyFull(
      long id,
      String name,
      List<Question> questions,
      Date created,
      Date validTill,
      String description) {
    this.id = id;
    this.name = name;
    this.questions = questions;
    this.created = created;
    this.validTill = validTill;
    this.description = description;
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

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getValidTill() {
    return validTill;
  }

  public void setValidTill(Date validTill) {
    this.validTill = validTill;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public String toString() {
    return "SurveyFull{"
        + "id="
        + id
        + ", name='"
        + name
        + '\''
        + ", questions="
        + questions
        + ", created="
        + created
        + ", validTill="
        + validTill
        + ", description="
        + description
        + '}';
  }
}
