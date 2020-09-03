package com.mahendra.survey.response;

import java.util.List;

public class Question {
  long id;
  String question;
  Type type;
  List<Option> options;
  String validation;

  public Question(long id, String question, Type type, List<Option> options, String validation) {
    this.id = id;
    this.question = question;
    this.type = type;
    this.options = options;
    this.validation = validation;
  }

  public Question() {}

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getQuestion() {
    return question;
  }

  public void setQuestion(String question) {
    this.question = question;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public List<Option> getOptions() {
    return options;
  }

  public void setOptions(List<Option> options) {
    this.options = options;
  }

  public String getValidation() {
    return validation;
  }

  public void setValidation(String validation) {
    this.validation = validation;
  }

  @Override
  public String toString() {
    return "Question{"
        + "id="
        + id
        + ", question='"
        + question
        + '\''
        + ", type="
        + type
        + ", options="
        + options
        + ", validation='"
        + validation
        + '\''
        + '}';
  }
}
