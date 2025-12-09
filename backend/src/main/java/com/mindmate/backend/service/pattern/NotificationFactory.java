package com.mindmate.backend.service.pattern;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationFactory {
    
    private final TwilioAdapter twilioAdapter;
    private final FirebaseAdapter firebaseAdapter;
    private final SendGridAdapter sendGridAdapter;
    
    public NotificationAdapter getNotificationService(String type) {
        if (type.equalsIgnoreCase("SMS")) {
            return twilioAdapter;
        } else if (type.equalsIgnoreCase("PUSH")) {
            return firebaseAdapter;
        } else if (type.equalsIgnoreCase("EMAIL")) {
            return sendGridAdapter;
        }
        throw new IllegalArgumentException("Unknown notification type: " + type);
    }
}
