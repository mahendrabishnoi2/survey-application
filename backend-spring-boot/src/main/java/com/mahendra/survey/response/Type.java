package com.mahendra.survey.response;

public class Type {
  long id;
  String typeName;

  public Type(long id, String typeName) {
    this.id = id;
    this.typeName = typeName;
  }

  public Type() {

  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getTypeName() {
    return typeName;
  }

  public void setTypeName(String typeName) {
    this.typeName = typeName;
  }
}
