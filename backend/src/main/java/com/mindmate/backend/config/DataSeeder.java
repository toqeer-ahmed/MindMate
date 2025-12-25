package com.mindmate.backend.config;

import com.mindmate.backend.domain.*;
import com.mindmate.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final AdvisorRepository advisorRepository;
    private final CourseRepository courseRepository;
    private final AssessmentRepository assessmentRepository;
    private final EncryptionService encryptionService;
    private final MoodRepository moodRepository;
    private final TaskRepository taskRepository;
    private final JournalRepository journalRepository;
    private final AlertRepository alertRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Only skip if our specific test user exists
        if (studentRepository.findByEmail("student@mindmate.com").isPresent()) {
            return;
        }

        System.out.println("Seeding dummy data...");

        // 1. Create Advisor
        Advisor advisor = Advisor.builder()
                .firstName("Dr. Sarah")
                .lastName("Connor")
                .email("advisor@mindmate.com")
                .password(encryptionService.hashPassword("password123"))
                .role(Role.ADVISOR)
                .department("Computer Science")
                .officeLocation("Room 304, Block B")
                .build();
        advisorRepository.save(advisor);

        // 2. Create Student
        Student student = Student.builder()
                .firstName("Toqeer")
                .lastName("Ahmed")
                .email("student@mindmate.com")
                .password(encryptionService.hashPassword("password123"))
                .role(Role.STUDENT)
                .studentId("FA21-BCS-001")
                .department("Computer Science")
                .build();
        student = studentRepository.save(student);

        // 3. Add Courses & Assessments
        createCourse(student, "Software Design & Architecture", 3, 85.5);
        createCourse(student, "Artificial Intelligence", 3, 92.0);
        createCourse(student, "Linear Algebra", 3, 78.5);

        // 4. Add Mood Entries (Last 10 days)
        createMood(student, 8.5, "Feeling great about the project!", 0);
        createMood(student, 6.0, "A bit tired.", 1);
        createMood(student, 3.5, "Stressed due to deadlines.", 2);
        createMood(student, 7.0, "Recovering, good workout.", 3);
        createMood(student, 6.5, "Normal day.", 4);
        createMood(student, 4.0, "Had a rough night sleep.", 5);
        createMood(student, 8.0, "Productive study session.", 6);
        createMood(student, 5.5, "Feeling okay, just average.", 7);
        createMood(student, 2.0, "Very anxious about exams.", 8);
        createMood(student, 9.0, "Celebrated birthday!", 9);

        // 5. Add Tasks
        createTask(student, "Submit SDA Assignment 3", "2025-12-28", false);
        createTask(student, "Morning Run", "2025-12-27", true);
        createTask(student, "Doctor Appointment", "2025-12-30", false);

        // 6. Add Journal
        createJournal(student, "My Reflection", "Today was a productive day. I finally fixed the backend issues in the project. The team is happy.");

        // 7. Add Alert (from Advisor)
        createAlert(student, "Please meet me regarding your recent mood drop.", "ADVISOR_TO_STUDENT");

        System.out.println("Dummy data seeded successfully!");
        System.out.println("Student Login: student@mindmate.com / password123");
        System.out.println("Advisor Login: advisor@mindmate.com / password123");
    }

    private void createCourse(Student student, String name, int credits, double dummyMarks) {
        Course course = Course.builder()
                .courseName(name)
                .creditHours(credits)
                .student(student)
                .build();
        course = courseRepository.save(course);
        
        // Add fake assessments
        Assessment a1 = Assessment.builder()
                .name("Quiz 1")
                .type(AssessmentType.QUIZ)
                .totalMarks(10)
                .obtainedMarks(dummyMarks > 90 ? 9 : 8)
                .weightage(10)
                .course(course)
                .build();
        assessmentRepository.save(a1);
        
        Assessment a2 = Assessment.builder()
                .name("Midterm")
                .type(AssessmentType.MIDTERM)
                .totalMarks(50)
                .obtainedMarks(dummyMarks > 80 ? 42 : 35)
                .weightage(30)
                .course(course)
                .build();
        assessmentRepository.save(a2);
    }

    private void createMood(Student student, double score, String note, int daysAgo) {
        MoodEntry mood = MoodEntry.builder()
                .student(student)
                .moodScore((int) score)
                .note(note)
                .timestamp(LocalDateTime.now().minusDays(daysAgo))
                .build();
        moodRepository.save(mood);
    }

    private void createTask(Student student, String title, String date, boolean completed) {
        Task task = Task.builder()
                .student(student)
                .title(title)
                .dueDate(java.time.LocalDate.parse(date))
                .status(completed ? TaskStatus.DONE : TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .build();
        if (completed) {
            task.setCompletedAt(LocalDateTime.now());
        }
        taskRepository.save(task);
    }

    private void createJournal(Student student, String title, String content) {
        JournalEntry entry = JournalEntry.builder()
                .student(student)
                .title(title)
                .content(encryptionService.encrypt(content))
                .createdAt(LocalDateTime.now())
                .build();
        journalRepository.save(entry);
    }

    private void createAlert(Student student, String msg, String type) {
        Alert alert = Alert.builder()
                .student(student)
                .message(msg)
                .type(type)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        alertRepository.save(alert);
    }
}
