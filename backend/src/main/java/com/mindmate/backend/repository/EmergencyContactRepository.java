package com.mindmate.backend.repository;

import com.mindmate.backend.domain.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {
    List<EmergencyContact> findByStudentId(Long studentId);
}
