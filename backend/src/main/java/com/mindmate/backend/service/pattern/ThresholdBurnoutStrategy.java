package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.domain.Student;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ThresholdBurnoutStrategy implements BurnoutDetectionStrategy {
    @Override
    public boolean detectBurnout(Student student) {
        List<MoodEntry> entries = student.getMoodEntries();
        if (entries == null || entries.isEmpty()) return false;
        
        // Simple logic: if last 3 entries average < 4
        int count = 0;
        int sum = 0;
        for (int i = 0; i < Math.min(entries.size(), 3); i++) {
            sum += entries.get(i).getMoodScore();
            count++;
        }
        return (double) sum / count < 4.0;
    }
}
