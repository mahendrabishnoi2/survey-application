package com.mahendra.survey.response;

public class Option {
  long id;
  String name;

  public Option(long id, String name) {
    this.id = id;
    this.name = name;
  }

  public Option() {}

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
}
