package com.mindmate.backend.service;

import com.mindmate.backend.config.EncryptionService;
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
    private final EncryptionService encryptionService;

    public JournalEntryDTO createEntry(String email, JournalEntryDTO dto) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Encrypt content
        String encryptedContent = encryptionService.encrypt(dto.getContent());

        JournalEntry entry = JournalEntry.builder()
                .student(student)
                .title(dto.getTitle())
                .content(encryptedContent)
                .moodTag(dto.getMoodTag())
                .createdAt(LocalDateTime.now())
                .build();

        JournalEntry saved = journalRepository.save(entry);
        
        // Return decrypted
        return mapToDTO(saved);
    }

    public List<JournalEntryDTO> getEntries(String email) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return journalRepository.findByStudentIdOrderByCreatedAtDesc(student.getId())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private JournalEntryDTO mapToDTO(JournalEntry entry) {
        // Decrypt content
        String decryptedContent = encryptionService.decrypt(entry.getContent());

        return JournalEntryDTO.builder()
                .id(entry.getId())
                .title(entry.getTitle())
                .content(decryptedContent)
                .moodTag(entry.getMoodTag())
                .createdAt(entry.getCreatedAt())
                .build();
    }
}
