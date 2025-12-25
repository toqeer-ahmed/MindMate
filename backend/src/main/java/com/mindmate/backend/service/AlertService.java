package com.mindmate.backend.service;

import com.mindmate.backend.domain.Alert;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.repository.AlertRepository;
import com.mindmate.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final StudentRepository studentRepository;

    public void createAlert(Long studentId, String message, String type) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Alert alert = Alert.builder()
                .student(student)
                .message(message)
                .type(type)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        
        alertRepository.save(alert);
    }

    public List<Alert> getStudentAlerts(String email) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return alertRepository.findByStudentIdOrderByTimestampDesc(student.getId());
    }

    public void markAsRead(Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setRead(true);
        alertRepository.save(alert);
    }
}
