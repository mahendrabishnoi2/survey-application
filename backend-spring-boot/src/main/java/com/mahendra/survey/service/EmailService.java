package com.mahendra.survey.service;

@FunctionalInterface
public interface EmailService {
  void sendSimpleMessage(String to, String subject, String text);
}
