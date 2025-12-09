package com.mindmate.backend.controller;

import com.mindmate.backend.dto.JournalEntryDTO;
import com.mindmate.backend.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;

    @PostMapping
    public ResponseEntity<JournalEntryDTO> createEntry(
            @RequestBody JournalEntryDTO request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(journalService.createEntry(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<JournalEntryDTO>> getEntries(
            Authentication authentication
    ) {
        return ResponseEntity.ok(journalService.getEntries(authentication.getName()));
    }
}
