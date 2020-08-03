package com.mahendra.survey.dao;

import com.mahendra.survey.entity.InputTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "inputTypes", path = "input-types")
public interface InputTypesRepository extends JpaRepository<InputTypes, Long> {}
