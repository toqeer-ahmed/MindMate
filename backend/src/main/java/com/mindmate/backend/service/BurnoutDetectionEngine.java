package com.mindmate.backend.service;

import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.service.pattern.DailyBurnoutDetection;
import com.mindmate.backend.service.pattern.MoodObserver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BurnoutDetectionEngine implements MoodObserver {

    private final DailyBurnoutDetection dailyBurnoutDetection;

    @Override
    public void onMoodUpdate(MoodEntry moodEntry) {
        // Trigger burnout check
        dailyBurnoutDetection.checkBurnout(moodEntry.getStudent());
    }
}
