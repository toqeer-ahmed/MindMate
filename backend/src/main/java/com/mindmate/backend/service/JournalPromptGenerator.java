package com.mindmate.backend.service;

import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.service.pattern.MoodObserver;
import org.springframework.stereotype.Service;

@Service
public class JournalPromptGenerator implements MoodObserver {

    @Override
    public void onMoodUpdate(MoodEntry moodEntry) {
        if (moodEntry.getMoodScore() < 5) {
            System.out.println("Generating prompt: 'What is bothering you today?' for student " + moodEntry.getStudent().getEmail());
        } else {
            System.out.println("Generating prompt: 'What went well today?' for student " + moodEntry.getStudent().getEmail());
        }
    }
}
