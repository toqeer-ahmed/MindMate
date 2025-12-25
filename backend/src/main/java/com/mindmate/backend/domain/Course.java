package com.mindmate.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;
    private int creditHours;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Assessment> assessments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private Student student;

    // Helper method to calculate current percentage in course
    public double calculateCurrentPercentage() {
        if (assessments == null || assessments.isEmpty()) return 100.0;
        double totalWeightedMarks = 0;
        double totalWeightage = 0;
        
        for (Assessment a : assessments) {
            if (a.getTotalMarks() > 0) {
                double percentage = (a.getObtainedMarks() / a.getTotalMarks()) * 100;
                totalWeightedMarks += (percentage * a.getWeightage());
                totalWeightage += a.getWeightage();
            }
        }
        
        if (totalWeightage == 0) return 100.0;
        return totalWeightedMarks / totalWeightage;
    }
}
