package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.domain.Course;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ThresholdBurnoutStrategy implements BurnoutDetectionStrategy {
    @Override
    public boolean detectBurnout(Student student) {
        // 1. Check Moods (Emotional Burnout)
        boolean emotionalBurnout = false;
        List<MoodEntry> entries = student.getMoodEntries();
        if (entries != null && !entries.isEmpty()) {
            int count = 0;
            int sum = 0;
            for (int i = 0; i < Math.min(entries.size(), 3); i++) {
                sum += entries.get(i).getMoodScore();
                count++;
            }
            if ((double) sum / count < 4.0) {
                emotionalBurnout = true;
            }
        }

        // 2. Check Academic Performance (Academic Burnout/Risk)
        boolean academicBurnout = false;
        if (student.getCourses() != null && !student.getCourses().isEmpty()) {
            for (Course course : student.getCourses()) {
                if (course.calculateCurrentPercentage() < 60.0) {
                    academicBurnout = true;
                    break;
                }
            }
        }

        return emotionalBurnout || academicBurnout;
    }
}
