package com.mindmate.backend.repository;

import com.mindmate.backend.domain.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoodRepository extends JpaRepository<MoodEntry, Long> {
    List<MoodEntry> findByStudentIdOrderByTimestampDesc(Long studentId);
}
