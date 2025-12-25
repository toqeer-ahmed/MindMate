package com.mindmate.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DailySummaryDTO {
    private LocalDate date;
    private Double averageMood;
    private List<MoodEntryDTO> moodEntries; // Reuse existing DTO
    private List<TaskRequestDTO> completedTasks; // Reuse existing DTO
    private List<JournalEntryDTO> journalEntries; // Reuse existing DTO
    private Double wellnessScore; // Calculated for that day
}
