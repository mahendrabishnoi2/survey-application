package com.mahendra.survey.dao;

import com.mahendra.survey.entity.Questions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "questions", path = "questions")
public interface QuestionsRepository extends JpaRepository<Questions, Long> {}
