package com.mahendra.survey.service;

import com.mahendra.survey.dao.RespondantRepository;
import com.mahendra.survey.dao.SurveyHeaderRepository;
import com.mahendra.survey.entity.InputTypes;
import com.mahendra.survey.entity.Questions;
import com.mahendra.survey.entity.QuestionsOptions;
import com.mahendra.survey.entity.Respondant;
import com.mahendra.survey.entity.SurveyHeader;
import com.mahendra.survey.response.Option;
import com.mahendra.survey.response.Question;
import com.mahendra.survey.response.SurveyFull;
import com.mahendra.survey.response.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SurveyService {

  @Autowired SurveyHeaderRepository surveyHeaderRepository;
  @Autowired RespondantRepository respondantRepository;

  public SurveyFull getSurvey(Long surveyId) {

    SurveyFull surveyFull = new SurveyFull();

    SurveyHeader surveyHeader = surveyHeaderRepository.findById(surveyId).get();
    long sId = surveyHeader.getId();
    surveyFull.setId(sId);
    String sName = surveyHeader.getSurveyName();
    surveyFull.setName(sName);
    List<Question> questionList = new ArrayList<>();

    Set<Questions> questions = surveyHeader.getQuestions();
    for (Questions questions1 : questions) {
      Set<QuestionsOptions> questionsOptions = questions1.getQuestionsOptions();
      InputTypes inputTypes = questions1.getInputTypeId();

      Type type = new Type();
      type.setId(inputTypes.getId());
      type.setTypeName(inputTypes.getInputTypeName());

      Question question = new Question();
      question.setId(questions1.getId());
      question.setQuestion(questions1.getQuestionName());
      question.setType(type);

      List<Option> options = new ArrayList<>();
      if (!type.getTypeName().contains("line")) {
        for (QuestionsOptions questionsOptions1 : questions1.getQuestionsOptions()) {
          Option option = new Option();
          option.setId(questionsOptions1.getId());
          option.setName(questionsOptions1.getOptionName());
          options.add(option);
        }
      }
      question.setOptions(options);
      questionList.add(question);
    }
    surveyFull.setQuestions(questionList);

    return surveyFull;
  }

  // check if a respondant has already taken survey with given surveyId
  public boolean verifyRespondant(Respondant respondant, Long surveyId) {
    String email = respondant.getEmail();
    String fullName = respondant.getFullName();
    List<Respondant> respondants = respondantRepository.findByEmailAndFullName(email, fullName);

    for (Respondant respondant1: respondants) {
      Long id = respondant1.getSurveyHeader().getId();
      if (id.equals(surveyId)) {
        return true;
      }
    }

    return false;
  }
}

/*
survey by id
{
  surveyHeader: {
    id:
    name:
    other details:
    questions:{
      id:
      question:
      type:
      options:
    }
  }
}
 */
