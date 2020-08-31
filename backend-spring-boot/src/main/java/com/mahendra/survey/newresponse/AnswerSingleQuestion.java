package com.mahendra.survey.newresponse;

public class AnswerSingleQuestion {
  Long questionId;
  String questionText;
  String questionTypeText;
  String answerText;
  String selectedOptionIds;

  public AnswerSingleQuestion(
      Long questionId,
      String questionText,
      String questionTypeText,
      String answerText,
      String selectedOptionIds) {
    this.questionId = questionId;
    this.questionText = questionText;
    this.questionTypeText = questionTypeText;
    this.answerText = answerText;
    this.selectedOptionIds = selectedOptionIds;
  }

  public Long getQuestionId() {
    return questionId;
  }

  public void setQuestionId(Long questionId) {
    this.questionId = questionId;
  }

  public String getQuestionText() {
    return questionText;
  }

  public void setQuestionText(String questionText) {
    this.questionText = questionText;
  }

  public String getQuestionTypeText() {
    return questionTypeText;
  }

  public void setQuestionTypeText(String questionTypeText) {
    this.questionTypeText = questionTypeText;
  }

  public String getAnswerText() {
    return answerText;
  }

  public void setAnswerText(String answerText) {
    this.answerText = answerText;
  }

  public String getSelectedOptionIds() {
    return selectedOptionIds;
  }

  public void setSelectedOptionIds(String selectedOptionIds) {
    this.selectedOptionIds = selectedOptionIds;
  }

  @Override
  public String toString() {
    return "AnswerSingleQuestion{"
        + "questionId="
        + questionId
        + ", questionText='"
        + questionText
        + '\''
        + ", questionTypeText='"
        + questionTypeText
        + '\''
        + ", answerText='"
        + answerText
        + '\''
        + ", selectedOptionIds='"
        + selectedOptionIds
        + '\''
        + '}';
  }
}
