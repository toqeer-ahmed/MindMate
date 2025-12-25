package com.mindmate.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "students")
public class Student extends User {
    private String studentId;
    private String department;

    @OneToMany(mappedBy = "student")
    private List<MoodEntry> moodEntries;

    @OneToMany(mappedBy = "student")
    private List<JournalEntry> journalEntries;

    @OneToMany(mappedBy = "student")
    private List<Task> tasks;

    @OneToMany(mappedBy = "student")
    private List<EmergencyContact> emergencyContacts;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Course> courses;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Alert> alerts;
}
