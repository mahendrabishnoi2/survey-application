package com.mahendra.survey.newresponse;

import java.time.Instant;
import java.util.List;

public class SurveyUserResponse {
  Long id;
  String fullName;
  String email;
  Instant submitDate;
  List<AnswerSingleQuestion> answers;

  public SurveyUserResponse(
      Long id, String fullName, String email, Instant submitDate, List<AnswerSingleQuestion> answers) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.submitDate = submitDate;
    this.answers = answers;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Instant getSubmitDate() {
    return submitDate;
  }

  public void setSubmitDate(Instant submitDate) {
    this.submitDate = submitDate;
  }

  public List<AnswerSingleQuestion> getAnswers() {
    return answers;
  }

  public void setAnswers(List<AnswerSingleQuestion> answers) {
    this.answers = answers;
  }

  @Override
  public String toString() {
    return "SurveyUserResponse{"
        + "id="
        + id
        + ", fullName='"
        + fullName
        + '\''
        + ", email='"
        + email
        + '\''
        + ", submitDate="
        + submitDate
        + ", answers="
        + answers
        + '}';
  }
}
