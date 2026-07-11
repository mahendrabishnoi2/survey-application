package com.mahendra.survey.entity;

import java.time.Instant;
import java.util.Set;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "survey_headers")
public class SurveyHeader {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "survey_name")
  private String surveyName;

  @Column(name = "creation_date")
  private Instant created;

  @Column(name = "valid_till")
  private Instant validTill;

  @Column(name = "description")
  private String description;

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

  @Override
  public String toString() {
    return "SurveyHeader{" +
        "id=" + id +
        ", surveyName='" + surveyName + '\'' +
        ", created=" + created +
        ", validTill=" + validTill +
        ", description='" + description + '\'' +
        ", questions=" + questions +
        ", respondants=" + respondants +
        '}';
  }
}
