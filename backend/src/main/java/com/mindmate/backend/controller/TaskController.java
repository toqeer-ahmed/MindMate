package com.mindmate.backend.controller;

import com.mindmate.backend.dto.TaskRequestDTO;
import com.mindmate.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskRequestDTO> createTask(
            @RequestBody TaskRequestDTO request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.createTask(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<TaskRequestDTO>> getTasks(
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.getTasks(authentication.getName()));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskRequestDTO> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequestDTO request
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
