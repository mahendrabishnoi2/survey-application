package com.mahendra.survey.entity;

import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "survey_headers")
public class SurveyHeader {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "survey_name")
  private String surveyName;

  @OneToMany(mappedBy = "surveyHeader", fetch = FetchType.EAGER)
  private Set<Questions> questions;

  @OneToMany(mappedBy = "surveyHeader", fetch = FetchType.EAGER)
  private Set<Respondant> respondants;

  public void addQuestion(Questions questions) {
    questions.setSurveyHeader(this);
  }

  public void setRespondants(Set<Respondant> respondants) {
    this.respondants = respondants;
    for (Respondant respondant : respondants) {
      respondant.setSurveyHeader(this);
    }
  }

  public void addRespondant(Respondant respondant) {
    respondant.setSurveyHeader(this);
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

  public Set<Questions> getQuestions() {
    return questions;
  }

  public void setQuestions(Set<Questions> questions) {
    this.questions = questions;
  }

  public Set<Respondant> getRespondants() {
    return respondants;
  }
}
