package com.mindmate.backend.service;

import com.mindmate.backend.domain.Student;
import com.mindmate.backend.domain.Task;
import com.mindmate.backend.domain.TaskStatus;
import com.mindmate.backend.dto.TaskRequestDTO;
import com.mindmate.backend.repository.StudentRepository;
import com.mindmate.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final StudentRepository studentRepository;

    public TaskRequestDTO createTask(String email, TaskRequestDTO dto) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Task task = Task.builder()
                .student(student)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .status(dto.getStatus())
                .priority(dto.getPriority())
                .build();

        if (dto.getStatus() == TaskStatus.DONE) {
            task.setCompletedAt(LocalDateTime.now());
        }

        Task saved = taskRepository.save(task);
        return mapToDTO(saved);
    }

    public List<TaskRequestDTO> getTasks(String email) {
        Student student = (Student) studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return taskRepository.findByStudentIdOrderByDueDateAsc(student.getId())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    
    public TaskRequestDTO updateTask(Long taskId, TaskRequestDTO dto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        
        // Handle completion timestamp
        if (dto.getStatus() == TaskStatus.DONE && task.getStatus() != TaskStatus.DONE) {
            task.setCompletedAt(LocalDateTime.now());
        } else if (dto.getStatus() != TaskStatus.DONE) {
            task.setCompletedAt(null);
        }

        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        
        Task saved = taskRepository.save(task);
        return mapToDTO(saved);
    }
    
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    private TaskRequestDTO mapToDTO(Task task) {
        return TaskRequestDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .priority(task.getPriority())
                .build();
    }
}
