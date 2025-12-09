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

    public List<WellnessReportDTO> getWellnessReports() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(this::generateReport).collect(Collectors.toList());
    }

    private WellnessReportDTO generateReport(Student student) {
        double avgMood = student.getMoodEntries().stream()
                .mapToInt(MoodEntry::getMoodScore)
                .average()
                .orElse(0.0);

        int journalCount = student.getJournalEntries().size();
        int tasksCompleted = (int) student.getTasks().stream()
                .filter(t -> t.getStatus().name().equals("DONE"))
                .count();

        String riskLevel = "LOW";
        if (avgMood > 0 && avgMood < 4) riskLevel = "HIGH";
        else if (avgMood >= 4 && avgMood < 6) riskLevel = "MEDIUM";

        return WellnessReportDTO.builder()
                .studentId(student.getId())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .averageMoodScore(avgMood)
                .journalCount(journalCount)
                .tasksCompleted(tasksCompleted)
                .riskLevel(riskLevel)
                .build();
    }
}
