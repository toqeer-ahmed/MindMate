package com.mindmate.backend.controller;

import com.mindmate.backend.dto.MoodEntryDTO;
import com.mindmate.backend.service.MoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mood")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class MoodController {

    private final MoodService moodService;

    @PostMapping
    public ResponseEntity<MoodEntryDTO> createMood(
            @RequestBody MoodEntryDTO request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(moodService.createMoodEntry(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<MoodEntryDTO>> getMoodHistory(
            Authentication authentication
    ) {
        return ResponseEntity.ok(moodService.getMoodHistory(authentication.getName()));
    }
}
