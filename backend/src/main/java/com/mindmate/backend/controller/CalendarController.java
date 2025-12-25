package com.mindmate.backend.controller;

import com.mindmate.backend.dto.DailySummaryDTO;
import com.mindmate.backend.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping("/summary")
    public ResponseEntity<DailySummaryDTO> getDailySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication
    ) {
        return ResponseEntity.ok(calendarService.getDailySummary(authentication.getName(), date));
    }
}
