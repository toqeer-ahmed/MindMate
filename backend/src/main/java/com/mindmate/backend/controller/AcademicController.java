package com.mindmate.backend.controller;

import com.mindmate.backend.domain.Assessment;
import com.mindmate.backend.domain.Course;
import com.mindmate.backend.service.AcademicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class AcademicController {

    private final AcademicService academicService;

    @PostMapping
    public ResponseEntity<Course> addCourse(
            @RequestBody Course course,
            Authentication authentication
    ) {
        return ResponseEntity.ok(academicService.addCourse(authentication.getName(), course));
    }

    @PostMapping("/{courseId}/assessments")
    public ResponseEntity<Course> addAssessment(
            @PathVariable Long courseId,
            @RequestBody Assessment assessment
    ) {
        return ResponseEntity.ok(academicService.addAssessment(courseId, assessment));
    }

    @GetMapping
    public ResponseEntity<List<Course>> getCourses(
            Authentication authentication
    ) {
        return ResponseEntity.ok(academicService.getStudentCourses(authentication.getName()));
    }
}
