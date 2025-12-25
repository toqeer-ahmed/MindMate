package com.mindmate.backend.controller;

import com.mindmate.backend.dto.WellnessReportDTO;
import com.mindmate.backend.service.AdvisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/advisor")
@RequiredArgsConstructor
public class AdvisorController {

    private final AdvisorService advisorService;

    @GetMapping("/reports")
    public ResponseEntity<List<WellnessReportDTO>> getReports() {
        return ResponseEntity.ok(advisorService.getWellnessReports());
    }

    @PostMapping("/send-alert/{studentId}")
    public ResponseEntity<Void> sendAlert(@PathVariable Long studentId, @RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        advisorService.sendAlert(studentId, message);
        return ResponseEntity.ok().build();
    }
}
