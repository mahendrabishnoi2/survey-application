package com.mahendra.survey;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.mahendra.survey.dao.*;
import com.mahendra.survey.entity.*;
import com.mahendra.survey.newresponse.AnswerSingleQuestion;
import com.mahendra.survey.newresponse.SurveyUserResponse;
import com.mahendra.survey.response.*;
import com.mahendra.survey.service.EmailService;
import com.mahendra.survey.service.SurveyService;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SurveyServiceTest {

    @Mock
    private SurveyHeaderRepository surveyHeaderRepository;

    @Mock
    private RespondantRepository respondantRepository;

    @Mock
    private QuestionsRepository questionsRepository;

    @Mock
    private InputTypesRepository inputTypesRepository;

    @Mock
    private QuestionsOptionsRepository questionsOptionsRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private SurveyService surveyService;

    private SurveyHeader surveyHeader;
    private Admin admin;
    private Respondant respondant;
    private Questions question;
    private InputTypes inputType;
    private SurveyUserResponse surveyUserResponse;
    private SurveyFull surveyFull;

    @BeforeEach
    void setUp() {
        // Setup common mock objects
        surveyHeader = new SurveyHeader();
        surveyHeader.setId(1L);
        surveyHeader.setSurveyName("Test Survey");
        surveyHeader.setCreated(Instant.now());
        surveyHeader.setValidTill(Instant.now().plusSeconds(86400)); // Tomorrow
        surveyHeader.setDescription("Test Description");

        admin = new Admin();
        admin.setId(1L);
        admin.setEmail("test@example.com");
        admin.setPassword("password");
        admin.setFirstName("Test");
        admin.setLastName("User");
        admin.setIsPrimaryAdmin((short) 1);

        respondant = new Respondant();
        respondant.setId(1L);
        respondant.setFullName("John Doe");
        respondant.setEmail("john@example.com");

        inputType = new InputTypes();
        inputType.setId(1L);
        inputType.setInputTypeName("radio");

        question = new Questions();
        question.setId(1L);
        question.setQuestionName("What is your favorite color?");
        question.setInputTypeId(inputType);
        question.setValidation("required");
        question.setQuestionsOptions(new HashSet<>()); // Initialize empty set

        Set<Questions> questions = new HashSet<>();
        questions.add(question);
        surveyHeader.setQuestions(questions);

        // Setup for saveSurveyResponse
        AnswerSingleQuestion answer = new AnswerSingleQuestion(1L, "Question?", "radio", "Blue", "1");
        surveyUserResponse = new SurveyUserResponse(1L, "John Doe", "john@example.com", Instant.now(), Collections.singletonList(answer));

        // Setup for saveSurvey
        surveyFull = new SurveyFull();
        surveyFull.setName("Test Survey");
        surveyFull.setCreated(Instant.now());
        surveyFull.setValidTill(Instant.now().plusSeconds(86400));
        surveyFull.setDescription("Test Description");

        Question q = new Question();
        q.setQuestion("Test Question");
        Type type = new Type();
        type.setTypeName("radio");
        q.setType(type);
        q.setValidation("required");
        Option option = new Option();
        option.setName("Option 1");
        q.setOptions(Collections.singletonList(option));

        surveyFull.setQuestions(Collections.singletonList(q));
    }

    @Test
    void deleteSurvey_ExistingSurvey_ShouldUpdateValidTill() {
        when(surveyHeaderRepository.findById(1L)).thenReturn(Optional.of(surveyHeader));
        when(surveyHeaderRepository.save(any(SurveyHeader.class))).thenReturn(surveyHeader);

        surveyService.deleteSurvey(1L);

        verify(surveyHeaderRepository).findById(1L);
        verify(surveyHeaderRepository).save(surveyHeader);
        assertTrue(surveyHeader.getValidTill().isBefore(Instant.now()));
    }

    @Test
    void deleteSurvey_NonExistingSurvey_ShouldDoNothing() {
        when(surveyHeaderRepository.findById(1L)).thenReturn(Optional.empty());

        surveyService.deleteSurvey(1L);

        verify(surveyHeaderRepository).findById(1L);
        verify(surveyHeaderRepository, never()).save(any());
    }

    @Test
    void verifyAdminLogin_ValidCredentials_ShouldReturnAdmin() {
        when(adminRepository.findByEmail("test@example.com")).thenReturn(admin);

        Admin result = surveyService.verifyAdminLogin(admin);

        assertEquals(admin, result);
        verify(adminRepository).findByEmail("test@example.com");
    }

    @Test
    void verifyAdminLogin_InvalidPassword_ShouldReturnFakeAdmin() {
        Admin wrongPasswordAdmin = new Admin();
        wrongPasswordAdmin.setEmail("test@example.com");
        wrongPasswordAdmin.setPassword("wrong");

        when(adminRepository.findByEmail("test@example.com")).thenReturn(admin);

        Admin result = surveyService.verifyAdminLogin(wrongPasswordAdmin);

        assertEquals(-1L, result.getId());
        verify(adminRepository).findByEmail("test@example.com");
    }

    @Test
    void verifyAdminLogin_NonExistingEmail_ShouldReturnFakeAdmin() {
        Admin nonExistingAdmin = new Admin();
        nonExistingAdmin.setEmail("nonexistent@example.com");
        nonExistingAdmin.setPassword("password");

        when(adminRepository.findByEmail("nonexistent@example.com")).thenReturn(null);

        Admin result = surveyService.verifyAdminLogin(nonExistingAdmin);

        assertEquals(-1L, result.getId());
        verify(adminRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    void getSurvey_ExistingSurvey_ShouldReturnSurveyFull() {
        when(surveyHeaderRepository.findById(1L)).thenReturn(Optional.of(surveyHeader));

        SurveyFull result = surveyService.getSurvey(1L);

        assertEquals(1L, result.getId());
        assertEquals("Test Survey", result.getName());
        assertEquals(1, result.getQuestions().size());
        verify(surveyHeaderRepository).findById(1L);
    }

    @Test
    void getSurvey_NonExistingSurvey_ShouldThrowException() {
        when(surveyHeaderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> surveyService.getSurvey(1L));
    }

    @Test
    void saveSurveyResponse_ValidResponse_ShouldSaveAndSendEmail() {
        when(surveyHeaderRepository.findById(1L)).thenReturn(Optional.of(surveyHeader));
        when(questionsRepository.findById(1L)).thenReturn(Optional.of(question));
        when(respondantRepository.save(any(Respondant.class))).thenReturn(respondant);

        boolean result = surveyService.saveSurveyResponse(surveyUserResponse);

        assertTrue(result);
        verify(respondantRepository).save(any(Respondant.class));
        verify(emailService).sendSimpleMessage(eq("john@example.com"), anyString(), anyString());
    }

    @Test
    void saveSurveyResponse_NonExistingSurvey_ShouldHandleException() {
        when(surveyHeaderRepository.findById(1L)).thenReturn(Optional.empty());

        boolean result = surveyService.saveSurveyResponse(surveyUserResponse);

        assertTrue(result);
        verify(emailService, never()).sendSimpleMessage(anyString(), anyString(), anyString());
    }

    @Test
    void verifyRespondant_ExistingRespondant_ShouldReturnTrue() {
        List<Respondant> respondants = Collections.singletonList(respondant);
        when(respondantRepository.findByEmailAndFullName("john@example.com", "John Doe")).thenReturn(respondants);
        respondant.setSurveyHeader(surveyHeader);

        boolean result = surveyService.verifyRespondant(respondant, 1L);

        assertTrue(result);
    }

    @Test
    void verifyRespondant_NonExistingRespondant_ShouldReturnFalse() {
        when(respondantRepository.findByEmailAndFullName("john@example.com", "John Doe")).thenReturn(Collections.emptyList());

        boolean result = surveyService.verifyRespondant(respondant, 1L);

        assertFalse(result);
    }

    @Test
    void saveSurvey_ValidSurvey_ShouldSaveAndReturnHeaders() {
        when(surveyHeaderRepository.save(any(SurveyHeader.class))).thenReturn(surveyHeader);
        when(inputTypesRepository.findAll()).thenReturn(Collections.singletonList(inputType));
        when(questionsRepository.save(any(Questions.class))).thenReturn(question);
        when(questionsOptionsRepository.save(any(QuestionsOptions.class))).thenReturn(new QuestionsOptions());

        Headers result = surveyService.saveSurvey(surveyFull);

        assertEquals(1L, result.getId());
        assertEquals("Test Survey", result.getSurveyName());
        verify(surveyHeaderRepository).save(any(SurveyHeader.class));
        verify(questionsRepository).save(any(Questions.class));
        verify(questionsOptionsRepository).save(any(QuestionsOptions.class));
    }

    @Test
    void getAllSurvey_ShouldReturnValidSurveys() {
        List<SurveyHeader> surveys = Collections.singletonList(surveyHeader);
        when(surveyHeaderRepository.findAll()).thenReturn(surveys);

        List<Headers> result = surveyService.getAllSurvey();

        assertEquals(1, result.size());
        assertEquals("Test Survey", result.get(0).getSurveyName());
    }

    @Test
    void getSurveyResponses_ExistingSurvey_ShouldReturnResponses() {
        Set<Respondant> respondants = new HashSet<>();
        respondants.add(respondant);
        surveyHeader.setRespondants(respondants);

        Set<Questions> questions = new HashSet<>();
        questions.add(question);
        surveyHeader.setQuestions(questions);

        Set<Answers> answers = new HashSet<>();
        Answers answer = new Answers();
        answer.setAnswerText("Blue");
        answer.setQuestionId(question);
        answers.add(answer);
        respondant.setAnswers(answers);

        when(surveyHeaderRepository.findById(1L)).thenReturn(Optional.of(surveyHeader));

        List<Response> result = surveyService.getSurveyResponses(1L);

        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getFullName());
    }
}