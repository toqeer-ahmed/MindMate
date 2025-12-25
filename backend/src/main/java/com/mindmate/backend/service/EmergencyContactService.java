package com.mindmate.backend.service;

import com.mindmate.backend.domain.EmergencyContact;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.repository.EmergencyContactRepository;
import com.mindmate.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyContactService {

    private final EmergencyContactRepository contactRepository;
    private final StudentRepository studentRepository;

    public EmergencyContact addContact(String email, EmergencyContact contact) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        contact.setStudent(student);
        return contactRepository.save(contact);
    }

    public List<EmergencyContact> getContacts(String email) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return contactRepository.findByStudentId(student.getId());
    }

    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
}
