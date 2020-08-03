package com.mahendra.survey.entity;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "respondants")
public class Respondant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String email;
  private String fullName;

  @ManyToOne
  @JoinColumn(name = "survey_id")
  private SurveyHeader surveyHeader;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "respondant", fetch = FetchType.EAGER)
  private Set<Answers> answers;

  public void setSurveyHeader(SurveyHeader surveyHeader) {
    if (surveyHeader != null) {
      if (surveyHeader.getRespondants() == null) {
        surveyHeader.setRespondants(new HashSet<>());
      }
      surveyHeader.getRespondants().add(this);
    }
    this.surveyHeader = surveyHeader;
  }

  public void setAnswers(Set<Answers> answers) {
    this.answers = answers;
    for (Answers answer: answers) {
      answer.setRespondant(this);
    }
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

  public Set<Answers> getAnswers() {
    return answers;
  }
}
