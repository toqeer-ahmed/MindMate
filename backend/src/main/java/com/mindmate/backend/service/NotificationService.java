package com.mindmate.backend.service;

import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.service.pattern.MoodObserver;
import com.mindmate.backend.service.pattern.NotificationFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService implements MoodObserver {

    private final NotificationFactory notificationFactory;

    @Override
    public void onMoodUpdate(MoodEntry moodEntry) {
        if (moodEntry.getMoodScore() <= 3) {
            // Send alert
            notificationFactory.getNotificationService("EMAIL")
                    .sendNotification(moodEntry.getStudent().getEmail(), "We noticed your mood is low. Here are some resources.");
        }
    }
    
    public void sendNotification(String type, String recipient, String message) {
        notificationFactory.getNotificationService(type).sendNotification(recipient, message);
    }
}
