package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DailyBurnoutDetection extends BaseBurnoutDetectionTemplate {

    private final ThresholdBurnoutStrategy strategy;

    @Override
    protected void loadStudentData(Student student) {
        System.out.println("Loading daily data for " + student.getEmail());
    }

    @Override
    protected boolean analyzeData(Student student) {
        return strategy.detectBurnout(student);
    }

    @Override
    protected void notifyAdvisor(Student student) {
        System.out.println("Alerting advisor for daily burnout risk: " + student.getEmail());
    }

    @Override
    protected void suggestIntervention(Student student) {
        System.out.println("Suggesting short break.");
    }
}
