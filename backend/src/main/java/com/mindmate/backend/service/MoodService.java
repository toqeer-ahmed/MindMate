package com.mindmate.backend.service;

import com.mindmate.backend.domain.MoodEntry;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.dto.MoodEntryDTO;
import com.mindmate.backend.repository.MoodRepository;
import com.mindmate.backend.repository.StudentRepository;
import com.mindmate.backend.service.pattern.MoodObserver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoodService {

    private final MoodRepository moodRepository;
    private final StudentRepository studentRepository;
    
    // Observers
    private final BurnoutDetectionEngine burnoutDetectionEngine;
    private final NotificationService notificationService;
    private final JournalPromptGenerator journalPromptGenerator;

    private List<MoodObserver> getObservers() {
        return List.of(burnoutDetectionEngine, notificationService, journalPromptGenerator);
    }

    public MoodEntryDTO createMoodEntry(String email, MoodEntryDTO dto) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        MoodEntry entry = MoodEntry.builder()
                .student(student)
                .moodScore(dto.getMoodScore())
                .moodLabel(dto.getMoodLabel())
                .note(dto.getNote())
                .timestamp(LocalDateTime.now())
                .build();

        MoodEntry saved = moodRepository.save(entry);

        // Notify observers
        notifyObservers(saved);

        return mapToDTO(saved);
    }

    public List<MoodEntryDTO> getMoodHistory(String email) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return moodRepository.findByStudentIdOrderByTimestampDesc(student.getId())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private void notifyObservers(MoodEntry entry) {
        for (MoodObserver observer : getObservers()) {
            observer.onMoodUpdate(entry);
        }
    }

    private MoodEntryDTO mapToDTO(MoodEntry entry) {
        return MoodEntryDTO.builder()
                .id(entry.getId())
                .moodScore(entry.getMoodScore())
                .moodLabel(entry.getMoodLabel())
                .note(entry.getNote())
                .timestamp(entry.getTimestamp())
                .build();
    }
}
