package com.mahendra.survey.dao;

import com.mahendra.survey.entity.Respondant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RespondantRepository extends JpaRepository<Respondant, Long> {
  List<Respondant> findByEmailAndFullName(String email, String fullName);
}
