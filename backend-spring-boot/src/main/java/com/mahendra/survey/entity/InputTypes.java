package com.mahendra.survey.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "input_types")
public class InputTypes {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "input_type")
  private String inputTypeName;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getInputTypeName() {
    return inputTypeName;
  }

  public void setInputTypeName(String inputTypeName) {
    this.inputTypeName = inputTypeName;
  }
}
