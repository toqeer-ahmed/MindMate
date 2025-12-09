package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.MoodEntry;

public interface MoodObserver {
    void onMoodUpdate(MoodEntry moodEntry);
}
