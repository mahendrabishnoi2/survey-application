package com.mahendra.survey.service;

import com.mahendra.survey.dao.AdminRepository;
import com.mahendra.survey.entity.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AdminService {
  @Autowired
  AdminRepository adminRepository;

  public Admin addAdmin(Admin admin) {
    Admin addedAdmin = adminRepository.save(admin);
    return addedAdmin;
  }
}
