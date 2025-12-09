package com.mindmate.backend.controller;

import com.mindmate.backend.dto.WellnessReportDTO;
import com.mindmate.backend.service.AdvisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/advisor")
@RequiredArgsConstructor
public class AdvisorController {

    private final AdvisorService advisorService;

    @GetMapping("/reports")
    // @PreAuthorize("hasRole('ADVISOR')") // In a real app, ensure only advisors can access
    public ResponseEntity<List<WellnessReportDTO>> getReports() {
        return ResponseEntity.ok(advisorService.getWellnessReports());
    }
}
