package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.Student;

public interface BurnoutDetectionStrategy {
    boolean detectBurnout(Student student);
}
