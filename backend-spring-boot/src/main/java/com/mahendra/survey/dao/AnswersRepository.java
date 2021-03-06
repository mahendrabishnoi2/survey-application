package com.mahendra.survey.dao;

import com.mahendra.survey.entity.Answers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "answers", path = "answers")
public interface AnswersRepository extends JpaRepository<Answers, Long> {}
