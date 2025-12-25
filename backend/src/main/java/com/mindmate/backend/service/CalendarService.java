package com.mindmate.backend.service;

import com.mindmate.backend.domain.Course;
import com.mindmate.backend.domain.JournalEntry;
import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.domain.Task;
import com.mindmate.backend.dto.DailySummaryDTO;
import com.mindmate.backend.dto.JournalEntryDTO;
import com.mindmate.backend.dto.MoodEntryDTO;
import com.mindmate.backend.dto.TaskRequestDTO;
import com.mindmate.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final StudentRepository studentRepository;
    private final MoodRepository moodRepository;
    private final TaskRepository taskRepository;
    private final JournalRepository journalRepository;
    private final CourseRepository courseRepository;

    public DailySummaryDTO getDailySummary(String email, LocalDate date) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Long studentId = student.getId();

        // 1. Fetch Moods for Date
        List<MoodEntry> moods = moodRepository.findByStudentIdOrderByTimestampDesc(studentId).stream()
                .filter(m -> m.getTimestamp().toLocalDate().equals(date))
                .collect(Collectors.toList());

        Double avgMood = moods.stream().mapToInt(MoodEntry::getMoodScore).average().orElse(0.0);

        // 2. Fetch Tasks Completed on this date
        List<Task> tasks = taskRepository.findByStudentId(studentId).stream()
                .filter(t -> t.getCompletedAt() != null && t.getCompletedAt().toLocalDate().equals(date))
                .collect(Collectors.toList());

        // 3. Fetch Journals
        List<JournalEntry> journals = journalRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .filter(j -> j.getCreatedAt().toLocalDate().equals(date))
                .collect(Collectors.toList());
        
        // 4. Fetch Academics
        List<Course> courses = courseRepository.findByStudentId(studentId);
        double academicTotal = 0;
        double academicAvg = 0;
        if (!courses.isEmpty()) {
            for (Course c : courses) {
                academicTotal += c.calculateCurrentPercentage();
            }
            academicAvg = academicTotal / courses.size();
        } else {
            academicAvg = 80.0; // Default assumption if no data
        }

        // 5. Calculate Wellness Score
        // Formula: (Mood 0-10 normalized to 0-100) * 0.5 + (Academic %) * 0.3 + (Tasks * 5) * 0.2
        // If mood is empty, we rely more on academics.
        
        double moodScore = avgMood * 10;
        if (moods.isEmpty()) moodScore = 50.0; // Neutral baseline

        double wellness = (moodScore * 0.5) + (academicAvg * 0.4) + (tasks.size() * 5);
        
        // Penalize for very low academic performance
        if (academicAvg < 50) wellness -= 10;

        if (wellness > 100) wellness = 100;
        if (wellness < 0) wellness = 0;

        return DailySummaryDTO.builder()
                .date(date)
                .averageMood(avgMood)
                .moodEntries(mapMoods(moods))
                .completedTasks(mapTasks(tasks))
                .journalEntries(mapJournals(journals))
                .wellnessScore(wellness)
                .build();
    }

    private List<MoodEntryDTO> mapMoods(List<MoodEntry> list) {
        return list.stream().map(m -> MoodEntryDTO.builder()
                .id(m.getId())
                .moodScore(m.getMoodScore())
                .moodLabel(m.getMoodLabel())
                .note(m.getNote())
                .timestamp(m.getTimestamp())
                .build()).collect(Collectors.toList());
    }

    private List<TaskRequestDTO> mapTasks(List<Task> list) {
        return list.stream().map(t -> TaskRequestDTO.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .dueDate(t.getDueDate())
                .status(t.getStatus())
                .priority(t.getPriority())
                .build()).collect(Collectors.toList());
    }
    
    private List<JournalEntryDTO> mapJournals(List<JournalEntry> list) {
        return list.stream().map(j -> JournalEntryDTO.builder()
                .id(j.getId())
                .title(j.getTitle())
                .content("Protected Content") 
                .createdAt(j.getCreatedAt())
                .build()).collect(Collectors.toList());
    }
}
