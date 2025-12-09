package com.mindmate.backend.service.pattern;

import org.springframework.stereotype.Component;

@Component
public class FirebaseAdapter implements NotificationAdapter {
    @Override
    public void sendNotification(String recipient, String message) {
        System.out.println("Sending Push Notification via Firebase to " + recipient + ": " + message);
    }
}
