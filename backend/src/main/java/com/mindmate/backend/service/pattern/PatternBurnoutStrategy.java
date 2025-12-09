package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.Student;
import org.springframework.stereotype.Component;

@Component
public class PatternBurnoutStrategy implements BurnoutDetectionStrategy {
    @Override
    public boolean detectBurnout(Student student) {
        // Mock Pattern implementation
        return false;
    }
}
