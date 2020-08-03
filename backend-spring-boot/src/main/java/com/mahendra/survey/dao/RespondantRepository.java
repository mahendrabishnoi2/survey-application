package com.mahendra.survey.dao;

import com.mahendra.survey.entity.Respondant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RespondantRepository extends JpaRepository<Respondant, Long> {}
