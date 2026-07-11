package com.mahendra.survey.entity;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "respondants")
public class Respondant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String email;
  private String fullName;
  private Instant takenOn;

  @ManyToOne
  @JoinColumn(name = "survey_id")
  private SurveyHeader surveyHeader;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "respondant", fetch = FetchType.EAGER)
  private Set<Answers> answers;

  public Instant getTakenOn() {
    return takenOn;
  }

  public void setTakenOn(Instant takenOn) {
    this.takenOn = takenOn;
  }

  public void addAnswer(Answers answers) {
    answers.setRespondant(this);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public SurveyHeader getSurveyHeader() {
    return surveyHeader;
  }

  public void setSurveyHeader(SurveyHeader surveyHeader) {
    if (surveyHeader != null) {
      if (surveyHeader.getRespondants() == null) {
        surveyHeader.setRespondants(new HashSet<>());
      }
      surveyHeader.getRespondants().add(this);
    }
    this.surveyHeader = surveyHeader;
  }

  public Set<Answers> getAnswers() {
    return answers;
  }

  public void setAnswers(Set<Answers> answers) {
    this.answers = answers;
    for (Answers answer : answers) {
      answer.setRespondant(this);
    }
  }
}
