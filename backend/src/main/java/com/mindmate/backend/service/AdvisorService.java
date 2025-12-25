package com.mindmate.backend.service;

import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.dto.WellnessReportDTO;
import com.mindmate.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdvisorService {

    private final StudentRepository studentRepository;
    private final NotificationService notificationService;
    private final AlertService alertService;

    public List<WellnessReportDTO> getWellnessReports() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(this::generateReport).collect(Collectors.toList());
    }

    public void sendAlert(Long studentId, String message) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Send email alert to student
        try {
            notificationService.sendNotification("EMAIL", student.getEmail(), "Advisor Alert: " + message);
        } catch (Exception e) {
            // Log error but continue to persist alert
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
        
        // Persist alert
        alertService.createAlert(studentId, message, "ADVISOR_TO_STUDENT");
    }

    private WellnessReportDTO generateReport(Student student) {
        double avgMood = student.getMoodEntries().stream()
                .mapToInt(MoodEntry::getMoodScore)
                .average()
                .orElse(0.0);

        int journalCount = student.getJournalEntries().size();
        int tasksCompleted = (int) student.getTasks().stream()
                .filter(t -> t.getStatus().name().equals("DONE")) // Assuming Enum name
                .count();

        // Calculate simplified Academic Risk (mocked or integrated)
        boolean academicRisk = student.getCourses() != null && student.getCourses().stream()
                .anyMatch(c -> c.calculateCurrentPercentage() < 60.0);

        String riskLevel = "LOW";
        if (avgMood > 0 && avgMood < 4) riskLevel = "HIGH";
        else if (avgMood >= 4 && avgMood < 6) riskLevel = "MEDIUM";
        
        if (academicRisk && !riskLevel.equals("HIGH")) {
            riskLevel = "MEDIUM"; // Elevate risk if academic performance is poor
        }

        return WellnessReportDTO.builder()
                .studentId(student.getId())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .averageMoodScore(avgMood)
                .journalCount(journalCount)
                .tasksCompleted(tasksCompleted)
                .riskLevel(riskLevel)
                .build();
    }

    public com.mindmate.backend.dto.StudentDetailDTO getStudentDetail(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<com.mindmate.backend.dto.MoodEntryDTO> recentMoods = student.getMoodEntries().stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(10)
                .map(m -> com.mindmate.backend.dto.MoodEntryDTO.builder()
                        .id(m.getId())
                        .moodScore(m.getMoodScore())
                        .moodLabel(m.getMoodLabel())
                        .note(m.getNote())
                        .timestamp(m.getTimestamp())
                        .build())
                .collect(Collectors.toList());

        List<com.mindmate.backend.dto.TaskRequestDTO> tasks = student.getTasks().stream()
                .map(t -> com.mindmate.backend.dto.TaskRequestDTO.builder()
                        .id(t.getId())
                        .title(t.getTitle())
                        .status(t.getStatus())
                        .description(t.getDescription())
                        .priority(t.getPriority())
                        .dueDate(t.getDueDate())
                        .build())
                .collect(Collectors.toList());

        return com.mindmate.backend.dto.StudentDetailDTO.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .recentMoods(recentMoods)
                .courses(student.getCourses())
                .tasks(tasks)
                .build();
    }
}
