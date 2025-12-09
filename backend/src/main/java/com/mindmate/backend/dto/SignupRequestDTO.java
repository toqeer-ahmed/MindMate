package com.mindmate.backend.dto;

import com.mindmate.backend.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Role role;
    
    // Student specific
    private String studentId;
    private String department;
    
    // Advisor specific
    private String officeLocation;
}
