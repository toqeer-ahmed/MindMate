package com.mindmate.backend.dto;

import com.mindmate.backend.domain.Course;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentDetailDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private List<MoodEntryDTO> recentMoods;
    private List<Course> courses;
    private List<TaskRequestDTO> tasks;
}
