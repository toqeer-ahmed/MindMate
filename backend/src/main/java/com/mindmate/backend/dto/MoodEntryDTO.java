package com.mindmate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MoodEntryDTO {
    private Long id;
    private int moodScore;
    private String moodLabel;
    private String note;
    private LocalDateTime timestamp;
}
