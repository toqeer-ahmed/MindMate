package com.mindmate.backend.repository;

import com.mindmate.backend.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    java.util.Optional<Student> findByEmail(String email);
}
