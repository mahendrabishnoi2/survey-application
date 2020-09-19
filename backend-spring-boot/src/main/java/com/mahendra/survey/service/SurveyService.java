package com.mahendra.survey.service;

import com.mahendra.survey.dao.AdminRepository;
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
import com.mahendra.survey.newresponse.AnswerSingleQuestion;
import com.mahendra.survey.newresponse.SurveyUserResponse;
import com.mahendra.survey.response.Headers;
import com.mahendra.survey.response.Option;
import com.mahendra.survey.response.Question;
import com.mahendra.survey.response.SurveyFull;
import com.mahendra.survey.response.Type;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SurveyService {

  @Autowired SurveyHeaderRepository surveyHeaderRepository;
  @Autowired RespondantRepository respondantRepository;
  @Autowired QuestionsRepository questionsRepository;
  @Autowired InputTypesRepository inputTypesRepository;
  @Autowired QuestionsOptionsRepository questionsOptionsRepository;
  @Autowired AdminRepository adminRepository;
  @Autowired EmailService emailService;

  public void deleteSurvey(Long id) {
    Optional<SurveyHeader> surveyHeaderOptional = surveyHeaderRepository.findById(id);
    if (surveyHeaderOptional.isPresent()) {
      SurveyHeader surveyHeader = surveyHeaderOptional.get();
      surveyHeader.setValidTill(new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000));
      surveyHeaderRepository.save(surveyHeader);
    }
  }

  public Admin verifyAdminLogin(Admin admin) {
    Admin adminRes = adminRepository.findByEmail(admin.getEmail());

    if (adminRes != null) {
      System.out.println(adminRes);
      return adminRes;
    }

    Admin fake = new Admin();
    fake.setId(-1l);
    return fake;
  }

  public SurveyFull getSurvey(Long surveyId) {

    SurveyFull surveyFull = new SurveyFull();

    SurveyHeader surveyHeader = surveyHeaderRepository.findById(surveyId).get();
    long sId = surveyHeader.getId();
    surveyFull.setId(sId);
    String sName = surveyHeader.getSurveyName();
    surveyFull.setName(sName);
    surveyFull.setCreated(surveyHeader.getCreated());
    surveyFull.setValidTill(surveyHeader.getValidTill());
    surveyFull.setDescription(surveyHeader.getDescription());
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
      question.setValidation(questions1.getValidation());

      List<Option> options = new ArrayList<>();
      if (!type.getTypeName().contains("line")) {
        for (QuestionsOptions questionsOptions1 : questions1.getQuestionsOptions()) {
          Option option = new Option();
          option.setId(questionsOptions1.getId());
          option.setName(questionsOptions1.getOptionName());
          options.add(option);
        }
      }

      options.sort(Comparator.comparingInt(a -> (int) a.getId()));

      question.setOptions(options);
      questionList.add(question);
    }
    questionList.sort(Comparator.comparingInt(a -> (int) a.getId()));
    surveyFull.setQuestions(questionList);

    return surveyFull;
  }

  // there can be many to many relationship between questionOptionsId and an answer
  public boolean saveSurveyResponse(SurveyUserResponse surveyUserResponse) {
    // name, email, submit date
    Respondant respondant = new Respondant();
    respondant.setFullName(surveyUserResponse.getFullName());
    respondant.setEmail(surveyUserResponse.getEmail());
    respondant.setTakenOn(surveyUserResponse.getSubmitDate());
    Long surveyId = surveyUserResponse.getId();

    List<AnswerSingleQuestion> answerSingleQuestionList = surveyUserResponse.getAnswers();
    Optional<SurveyHeader> surveyHeaderOptional = surveyHeaderRepository.findById(surveyId);
    try {
      SurveyHeader surveyHeader = surveyHeaderOptional.get();
      respondant.setSurveyHeader(surveyHeader);
      Set<Answers> answers = new HashSet<>();
      for (AnswerSingleQuestion answerSingleQuestion : answerSingleQuestionList) {
        Answers newAnswer = new Answers();
        newAnswer.setRespondant(respondant);
        // for now leave question options id and add an string field - selectedOptions
        newAnswer.setSelectedOptions(answerSingleQuestion.getSelectedOptionIds());
        newAnswer.setAnswerText(answerSingleQuestion.getAnswerText());

        Long qId = answerSingleQuestion.getQuestionId();
        Optional<Questions> questionsOptional = questionsRepository.findById(qId);
        Questions question = questionsOptional.get();

        newAnswer.setQuestionId(question);
        answers.add(newAnswer);
      }
      respondant.setAnswers(answers);

      respondantRepository.save(respondant);

      String to = surveyUserResponse.getEmail();
      String subject = "Response recorded for survey: " + surveyHeader.getSurveyName();
      String body =
          "Hi "
              + surveyUserResponse.getFullName()
              + "Your response to survey: "
              + surveyHeader.getSurveyName()
              + " has been recorded successfully. Thanks for taking this survey.\n\n"
              + "Thanks and Regards,\nCampaign Management System";

      emailService.sendSimpleMessage(to, subject, body);
    } catch (NoSuchElementException e) {
      System.out.println("Exception: Response to a survey that does not exist");
    }

    return true;
  }

  // check if a respondant has already taken survey with given surveyId
  public boolean verifyRespondant(Respondant respondant, Long surveyId) {
    String email = respondant.getEmail();
    String fullName = respondant.getFullName();
    List<Respondant> respondants = respondantRepository.findByEmailAndFullName(email, fullName);

    for (Respondant respondant1 : respondants) {
      Long id = respondant1.getSurveyHeader().getId();
      if (id.equals(surveyId)) {
        return true;
      }
    }

    return false;
  }

  // save a new survey to database
  public Headers saveSurvey(SurveyFull survey) {
    SurveyHeader surveyHeader = new SurveyHeader();
    surveyHeader.setSurveyName(survey.getName());
    surveyHeader.setCreated(survey.getCreated());
    surveyHeader.setValidTill(survey.getValidTill());
    surveyHeader.setDescription(survey.getDescription());

    SurveyHeader savedHeader = surveyHeaderRepository.save(surveyHeader);

    for (Question question : survey.getQuestions()) {
      Questions newQuestion = new Questions();
      newQuestion.setSurveyHeader(savedHeader);
      InputTypes inputType = getInputTypeObjectByName(question.getType().getTypeName());
      if (inputType != null) {
        newQuestion.setInputTypeId(inputType);
      }
      newQuestion.setQuestionName(question.getQuestion());
      newQuestion.setValidation(question.getValidation());

      Questions savedQuestion = questionsRepository.save(newQuestion);

      // if question contains options - i.e. question of type checkbox or radio
      if (question.getOptions().size() > 0) {
        for (Option option : question.getOptions()) {
          QuestionsOptions newOption = new QuestionsOptions();
          newOption.setOptionName(option.getName());
          newOption.setQuestionId(savedQuestion);
          questionsOptionsRepository.save(newOption);
        }
      }
      //      System.out.println(surveyHeaderRepository.findById(savedHeader.getId()).get());
    }

    return new Headers(savedHeader.getId(), savedHeader.getSurveyName());
  }

  private InputTypes getInputTypeObjectByName(String givenType) {
    List<InputTypes> inputTypes = inputTypesRepository.findAll();

    for (InputTypes type : inputTypes) {
      if (type.getInputTypeName().equalsIgnoreCase(givenType)) {
        return type;
      }
    }
    return null;
  }

  public List<Headers> getAllSurvey() {
    List<SurveyHeader> surveyHeaders = surveyHeaderRepository.findAll();
    List<Headers> dataToSend = new ArrayList<>();

    // sort surveys by their expiry date
    Collections.sort(surveyHeaders, Comparator.comparing(SurveyHeader::getValidTill));

    // truncate time part
    Date todayMidnight = DateUtils.truncate(new Date(), Calendar.DAY_OF_MONTH);
    Date tomorrowMidnight = DateUtils.addDays(todayMidnight, 1);

    for (SurveyHeader surveyHeader : surveyHeaders) {
      if (surveyHeader.getValidTill().compareTo(todayMidnight) >= 0) {
        dataToSend.add(new Headers(surveyHeader.getId(), surveyHeader.getSurveyName()));
      }
    }

    //    System.out.println(dataToSend);

    return dataToSend;
  }
}
