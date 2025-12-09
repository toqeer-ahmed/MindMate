package com.mindmate.backend.service.pattern;

import org.springframework.stereotype.Component;

@Component
public class SendGridAdapter implements NotificationAdapter {
    @Override
    public void sendNotification(String recipient, String message) {
        System.out.println("Sending Email via SendGrid to " + recipient + ": " + message);
    }
}
