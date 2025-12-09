package com.mindmate.backend.repository;

import com.mindmate.backend.domain.Advisor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdvisorRepository extends JpaRepository<Advisor, Long> {
}
