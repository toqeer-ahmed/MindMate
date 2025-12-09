package com.mindmate.backend.service;

import com.mindmate.backend.config.EncryptionService;
import com.mindmate.backend.config.JwtService;
import com.mindmate.backend.domain.Advisor;
import com.mindmate.backend.domain.Role;
import com.mindmate.backend.domain.Student;
import com.mindmate.backend.domain.User;
import com.mindmate.backend.dto.AuthenticationResponseDTO;
import com.mindmate.backend.dto.LoginRequestDTO;
import com.mindmate.backend.dto.SignupRequestDTO;
import com.mindmate.backend.repository.AdvisorRepository;
import com.mindmate.backend.repository.StudentRepository;
import com.mindmate.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AdvisorRepository advisorRepository;
    private final EncryptionService encryptionService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponseDTO register(SignupRequestDTO request) {
        User user;
        if (request.getRole() == Role.STUDENT) {
            user = Student.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .password(encryptionService.encrypt(request.getPassword()))
                    .role(Role.STUDENT)
                    .studentId(request.getStudentId())
                    .department(request.getDepartment())
                    .build();
            studentRepository.save((Student) user);
        } else {
            user = Advisor.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .password(encryptionService.encrypt(request.getPassword()))
                    .role(Role.ADVISOR)
                    .department(request.getDepartment())
                    .officeLocation(request.getOfficeLocation())
                    .build();
            advisorRepository.save((Advisor) user);
        }

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponseDTO.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    public AuthenticationResponseDTO authenticate(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponseDTO.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}
