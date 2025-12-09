package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.Student;
import org.springframework.stereotype.Component;

@Component
public class MLBurnoutStrategy implements BurnoutDetectionStrategy {
    @Override
    public boolean detectBurnout(Student student) {
        // Mock ML implementation
        return Math.random() < 0.1; // 10% chance
    }
}
