package com.mindmate.backend.service;

import com.mindmate.backend.domain.JournalEntry;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.dto.JournalEntryDTO;
import com.mindmate.backend.repository.JournalRepository;
import com.mindmate.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;
    private final StudentRepository studentRepository;

    public JournalEntryDTO createEntry(String email, JournalEntryDTO dto) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        JournalEntry entry = JournalEntry.builder()
                .student(student)
                .title(dto.getTitle())
                .content(dto.getContent())
                .moodTag(dto.getMoodTag())
                .createdAt(LocalDateTime.now())
                .build();

        JournalEntry saved = journalRepository.save(entry);
        return mapToDTO(saved);
    }

    public List<JournalEntryDTO> getEntries(String email) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return journalRepository.findByStudentIdOrderByCreatedAtDesc(student.getId())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private JournalEntryDTO mapToDTO(JournalEntry entry) {
        return JournalEntryDTO.builder()
                .id(entry.getId())
                .title(entry.getTitle())
                .content(entry.getContent())
                .moodTag(entry.getMoodTag())
                .createdAt(entry.getCreatedAt())
                .build();
    }
}
