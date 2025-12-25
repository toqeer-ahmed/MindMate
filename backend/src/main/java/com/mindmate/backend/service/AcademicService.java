package com.mindmate.backend.service;

import com.mindmate.backend.domain.*;
import com.mindmate.backend.repository.CourseRepository;
import com.mindmate.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final AlertService alertService;

    @Transactional
    public Course addCourse(String email, Course course) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        course.setStudent(student);
        return courseRepository.save(course);
    }

    @Transactional
    public Course addAssessment(Long courseId, Assessment assessment) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        assessment.setCourse(course);
        if (course.getAssessments() == null) {
            course.setAssessments(new ArrayList<>());
        }
        course.getAssessments().add(assessment);
        
        Course savedCourse = courseRepository.save(course);
        
        // Check for academic risk after adding assessment
        checkAcademicRisk(savedCourse.getStudent());
        
        return savedCourse;
    }

    public List<Course> getStudentCourses(String email) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return courseRepository.findByStudentId(student.getId());
    }

    public void checkAcademicRisk(Student student) {
        List<Course> courses = courseRepository.findByStudentId(student.getId());
        if (courses.isEmpty()) return;

        int coursesAtRisk = 0;
        for (Course course : courses) {
            if (course.calculateCurrentPercentage() < 60.0) { // Threshold
                coursesAtRisk++;
            }
        }

        if (coursesAtRisk > 0) {
            // Trigger Academic Risk Alert
            alertService.createAlert(
                student.getId(), 
                "Warning: You are falling behind in " + coursesAtRisk + " courses. Please contact your advisor.", 
                "SYSTEM_TO_STUDENT"
            );
            
            // Also notify Advisor (Conceptually)
            // In a real system, we'd map Student -> Advisor and alert the Advisor.
            // For now, we create a system alert that advisors can see in the dashboard view.
        }
    }
}
