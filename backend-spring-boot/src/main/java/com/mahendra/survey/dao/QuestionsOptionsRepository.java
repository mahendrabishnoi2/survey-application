package com.mahendra.survey.dao;

import com.mahendra.survey.entity.QuestionsOptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "questionsOptions", path = "questions-options")
public interface QuestionsOptionsRepository extends JpaRepository<QuestionsOptions, Long> {}
