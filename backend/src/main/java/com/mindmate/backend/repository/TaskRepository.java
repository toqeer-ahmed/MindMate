package com.mindmate.backend.repository;

import com.mindmate.backend.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStudentIdOrderByDueDateAsc(Long studentId);
}
