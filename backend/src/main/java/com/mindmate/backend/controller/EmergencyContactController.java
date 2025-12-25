package com.mindmate.backend.controller;

import com.mindmate.backend.domain.EmergencyContact;
import com.mindmate.backend.service.EmergencyContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/emergency-contacts")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService contactService;

    @PostMapping
    public ResponseEntity<EmergencyContact> addContact(
            @RequestBody EmergencyContact contact,
            Authentication authentication
    ) {
        return ResponseEntity.ok(contactService.addContact(authentication.getName(), contact));
    }

    @GetMapping
    public ResponseEntity<List<EmergencyContact>> getContacts(
            Authentication authentication
    ) {
        return ResponseEntity.ok(contactService.getContacts(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
