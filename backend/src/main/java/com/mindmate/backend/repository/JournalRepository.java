package com.mindmate.backend.repository;

import com.mindmate.backend.domain.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JournalRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
