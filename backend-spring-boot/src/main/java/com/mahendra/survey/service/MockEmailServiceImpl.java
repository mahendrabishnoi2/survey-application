package com.mahendra.survey.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class MockEmailServiceImpl implements EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MockEmailServiceImpl.class);

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        LOGGER.info("Mock Email Sent - To: {}, Subject: {}, Text: {}", to, subject, text);
    }
}