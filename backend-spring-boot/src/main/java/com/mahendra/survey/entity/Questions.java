package com.mahendra.survey.entity;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
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
@Table(name = "questions")
public class Questions {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "question_name")
  private String questionName;

  @Column(name = "validation")
  private String validation;

  @ManyToOne
  @JoinColumn(name = "input_type_id")
  private InputTypes inputTypeId;

  @ManyToOne
  @JoinColumn(name = "survey_id")
  private SurveyHeader surveyHeader;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "questionId", fetch = FetchType.EAGER)
  private Set<QuestionsOptions> questionsOptions;

  //  @OneToMany(mappedBy = "questionId")
  //  private Set<Answers> answers;

  public void addQuestionOption(QuestionsOptions questionsOptions) {
    questionsOptions.setQuestionId(this);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getQuestionName() {
    return questionName;
  }

  public void setQuestionName(String questionName) {
    this.questionName = questionName;
  }

  public InputTypes getInputTypeId() {
    return inputTypeId;
  }

  public void setInputTypeId(InputTypes inputTypeId) {
    this.inputTypeId = inputTypeId;
  }

  public SurveyHeader getSurveyHeader() {
    return surveyHeader;
  }

  public void setSurveyHeader(SurveyHeader surveyHeader) {
    if (surveyHeader != null) {
      if (surveyHeader.getQuestions() == null) {
        surveyHeader.setQuestions(new HashSet<>());
      }
      surveyHeader.getQuestions().add(this);
    }
    this.surveyHeader = surveyHeader;
  }

  public Set<QuestionsOptions> getQuestionsOptions() {
    return questionsOptions;
  }

  public void setQuestionsOptions(Set<QuestionsOptions> questionsOptions) {
    this.questionsOptions = questionsOptions;
    for (QuestionsOptions questionsOption : questionsOptions) {
      questionsOption.setQuestionId(this);
    }
  }

  public String getValidation() {
    return validation;
  }

  public void setValidation(String validation) {
    this.validation = validation;
  }
}
