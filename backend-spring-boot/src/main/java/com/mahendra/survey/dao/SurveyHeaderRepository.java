package com.mahendra.survey.dao;

import com.mahendra.survey.entity.SurveyHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "surveyHeader", path = "surveys")
public interface SurveyHeaderRepository extends JpaRepository<SurveyHeader, Long> {}
