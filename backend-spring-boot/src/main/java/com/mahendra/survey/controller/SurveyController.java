package com.mahendra.survey.controller;

import com.mahendra.survey.entity.Respondant;
import com.mahendra.survey.response.SurveyFull;
import com.mahendra.survey.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("api")
public class SurveyController {

  @Autowired SurveyService surveyService;

  @GetMapping("/surveys/{surveyId}")
  public SurveyFull getSurveyById(@PathVariable("surveyId") Long surveyId) {
    return surveyService.getSurvey(surveyId);
  }

  @PostMapping("/respondant/new/{surveyId}")
  public boolean verifyRespondant(
      @RequestBody Respondant respondant, @PathVariable("surveyId") Long surveyId) {
      return surveyService.verifyRespondant(respondant, surveyId);
  }
}
