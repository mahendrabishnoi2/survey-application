package com.mahendra.survey.response;

import java.time.Instant;
import java.util.List;

public class SurveyFull {
  long id;
  String name;
  List<Question> questions;
  Instant created;
  Instant validTill;
  String description;

  public SurveyFull() {}

  public SurveyFull(
      long id,
      String name,
      List<Question> questions,
      Instant created,
      Instant validTill,
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

  public Instant getCreated() {
    return created;
  }

  public void setCreated(Instant created) {
    this.created = created;
  }

  public Instant getValidTill() {
    return validTill;
  }

  public void setValidTill(Instant validTill) {
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
