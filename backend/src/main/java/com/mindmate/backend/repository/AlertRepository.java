package com.mindmate.backend.repository;

import com.mindmate.backend.domain.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByStudentIdOrderByTimestampDesc(Long studentId);
    List<Alert> findByStudentIdAndIsReadFalse(Long studentId);
}
