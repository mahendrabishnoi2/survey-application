package com.mahendra.survey;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.mahendra.survey.dao.AdminRepository;
import com.mahendra.survey.dao.AnswersRepository;
import com.mahendra.survey.dao.InputTypesRepository;
import com.mahendra.survey.dao.QuestionsOptionsRepository;
import com.mahendra.survey.dao.QuestionsRepository;
import com.mahendra.survey.dao.RespondantRepository;
import com.mahendra.survey.dao.SurveyHeaderRepository;
import com.mahendra.survey.entity.Admin;
import com.mahendra.survey.entity.Answers;
import com.mahendra.survey.entity.InputTypes;
import com.mahendra.survey.entity.Questions;
import com.mahendra.survey.entity.QuestionsOptions;
import com.mahendra.survey.entity.Respondant;
import com.mahendra.survey.entity.SurveyHeader;
import com.mahendra.survey.response.SurveyFull;
import com.mahendra.survey.service.SurveyService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CampaignRegistrationManagementSystemApplicationTests {

  @Autowired private AdminRepository adminRepository;
  @Autowired private InputTypesRepository inputTypesRepository;
  @Autowired private SurveyHeaderRepository surveyHeaderRepository;
  @Autowired private QuestionsRepository questionsRepository;
  @Autowired private QuestionsOptionsRepository questionsOptionsRepository;
  @Autowired private AnswersRepository answersRepository;
  @Autowired private RespondantRepository respondantRepository;
  @Autowired private SurveyService surveyService;

  @Test
  void contextLoads() {}

  @Test
  void testSurveyService() {
    SurveyFull surveyFull = surveyService.getSurvey(1L);
    //    9545163336
    System.out.println(surveyFull.getId());
  }

  // let's try adding an answer to our database
  @Test
  void addAnswer() {
    Answers answer = new Answers();
    Respondant respondant = new Respondant();
    SurveyHeader surveyHeader = surveyHeaderRepository.findById(1L).get();

    // create a respondant
    respondant.setSurveyHeader(surveyHeader);
    respondant.setEmail("mahendrabishnoi2@gmail.com");
    respondant.setFullName("Mahendra Bishnoi");

    // add respondant to answers
    answer.setAnswerText("");

    // get corresponding question
    Questions questions = questionsRepository.findById(1L).get();
    answer.setQuestionId(questions);

    QuestionsOptions questionsOptions = questionsOptionsRepository.findById(3L).get();
    answer.setQuestionOptionsId(questionsOptions);

    Set<Answers> answers = new HashSet<>();
    answers.add(answer);
    respondant.setAnswers(answers);

    respondantRepository.save(respondant);
  }

  // in this test we add a question to questions table, also add options (for MCQs) to
  // questions_options table
  @Test
  void addQuestion() {
    Questions questions = new Questions();
    InputTypes inputTypes = inputTypesRepository.findById(3L).get();
    questions.setInputTypeId(inputTypes);
    SurveyHeader surveyHeader = surveyHeaderRepository.findById(1L).get();
    questions.setSurveyHeader(surveyHeader);
    questions.setQuestionName("What is your name?");

    // create a set of QuestionOptions
    Set<QuestionsOptions> questionsOptions = new HashSet<>();
    List<String> options = Arrays.asList("Mahendra", "Neeraj", "Lokesh");
    for (String option : options) {
      QuestionsOptions questionsOption = new QuestionsOptions();
      questionsOption.setOptionName(option);
      questionsOptions.add(questionsOption);
    }

    // add above created options to this question
    questions.setQuestionsOptions(questionsOptions);
    questionsRepository.save(questions);
  }

  @Test
  void fillSurveyHeaders() {
    SurveyHeader surveyHeader = new SurveyHeader();
    surveyHeader.setSurveyName("test_survey");
    surveyHeaderRepository.save(surveyHeader);

    Optional<SurveyHeader> surveyHeaderOptional = surveyHeaderRepository.findById(1L);
    assertNotNull(surveyHeaderOptional);
    SurveyHeader surveyHeaderResult = surveyHeaderOptional.get();
    assertEquals(surveyHeader.getSurveyName(), surveyHeaderResult.getSurveyName());
  }

  @Test
  void fillAdmin() {
    Admin admin = new Admin();
    admin.setFirstName("b");
    admin.setLastName("b");
    admin.setEmail("b");
    admin.setPassword("b");
    admin.setIsPrimaryAdmin((short) 0);
    adminRepository.save(admin);
//
//    Optional<Admin> optionalAdmin = adminRepository.findById(1L);
//    assertNotNull(optionalAdmin);
//    admin = optionalAdmin.get();
//    assertEquals(admin.getFirstName(), "Mahendra");
//    assertEquals(admin.getLastName(), "Bishnoi");
//    assertEquals(admin.getEmail(), "m");
  }

  @Test
  void fillTypes() {
    List<String> inputTypesList =
        Arrays.asList("oneline", "multiline", "radio", "checkbox_multiselect");
    List<InputTypes> inputTypes = new ArrayList<>();

    for (String inputType : inputTypesList) {
      InputTypes inputTypesTemp = new InputTypes();
      inputTypesTemp.setInputTypeName(inputType);
      inputTypes.add(inputTypesTemp);
    }

    for (InputTypes inputTypesTemp : inputTypes) {
      inputTypesRepository.save(inputTypesTemp);
    }

    List<InputTypes> inputTypesResult = inputTypesRepository.findAll();
    for (InputTypes t : inputTypesResult) {
      int id = t.getId().intValue();
      assertEquals(inputTypes.get(id - 1).getInputTypeName(), t.getInputTypeName());
    }
  }
}
