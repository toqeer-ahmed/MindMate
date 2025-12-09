package com.mindmate.backend.service.pattern;

import org.springframework.stereotype.Component;

@Component
public class TwilioAdapter implements NotificationAdapter {
    @Override
    public void sendNotification(String recipient, String message) {
        System.out.println("Sending SMS via Twilio to " + recipient + ": " + message);
    }
}
