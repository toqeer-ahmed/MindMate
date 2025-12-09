package com.mindmate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WellnessReportDTO {
    private Long studentId;
    private String studentName;
    private double averageMoodScore;
    private int journalCount;
    private int tasksCompleted;
    private String riskLevel; // LOW, MEDIUM, HIGH
}
