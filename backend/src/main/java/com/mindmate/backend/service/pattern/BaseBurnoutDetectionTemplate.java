package com.mindmate.backend.service.pattern;

import com.mindmate.backend.domain.Student;

public abstract class BaseBurnoutDetectionTemplate {
    
    public final void checkBurnout(Student student) {
        loadStudentData(student);
        boolean isBurnout = analyzeData(student);
        if (isBurnout) {
            notifyAdvisor(student);
            suggestIntervention(student);
        }
        logResult(student, isBurnout);
    }

    protected abstract void loadStudentData(Student student);
    protected abstract boolean analyzeData(Student student); // This can use Strategy
    protected abstract void notifyAdvisor(Student student);
    protected abstract void suggestIntervention(Student student);
    
    protected void logResult(Student student, boolean result) {
        System.out.println("Burnout check for " + student.getEmail() + ": " + result);
    }
}
