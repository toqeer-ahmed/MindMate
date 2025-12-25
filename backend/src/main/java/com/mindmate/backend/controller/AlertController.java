package com.mindmate.backend.controller;

import com.mindmate.backend.domain.Alert;
import com.mindmate.backend.service.AlertService;
import com.mindmate.backend.service.AdvisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AlertController {

    private final AlertService alertService;
    private final AdvisorService advisorService;

    // STUDENT: Get my alerts
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Alert>> getStudentAlerts(Authentication authentication) {
        return ResponseEntity.ok(alertService.getStudentAlerts(authentication.getName()));
    }

    // STUDENT: Mark as read
    @PutMapping("/student/{id}/read")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        alertService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    // ADVISOR: Send alert
    @PostMapping("/advisor/send/{studentId}")
    @PreAuthorize("hasRole('ADVISOR')")
    public ResponseEntity<Void> sendAlert(@PathVariable Long studentId, @RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        advisorService.sendAlert(studentId, message); 
        return ResponseEntity.ok().build();
    }
}
