package com.mindmate.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private String title;
    private String description;
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status; // TODO, IN_PROGRESS, DONE
    
    @Enumerated(EnumType.STRING)
    private TaskPriority priority; // LOW, MEDIUM, HIGH

    private LocalDateTime completedAt;
}
