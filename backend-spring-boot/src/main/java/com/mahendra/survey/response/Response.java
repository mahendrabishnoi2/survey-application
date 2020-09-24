package com.mahendra.survey.response;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Response {
  private Long id;
  private String fullName;
  private String email;
  private List<String> questions;
  private List<String> answers;
}
