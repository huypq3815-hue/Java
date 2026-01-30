package com.capstone.planbookai.controller;

import com.capstone.planbookai.model.Role;
import com.capstone.planbookai.model.User;
import com.capstone.planbookai.payload.request.LoginRequest;
import com.capstone.planbookai.payload.request.SignupRequest;
import com.capstone.planbookai.payload.response.JwtResponse;
import com.capstone.planbookai.payload.response.MessageResponse;
import com.capstone.planbookai.repository.UserRepository;
import com.capstone.planbookai.security.jwt.JwtUtils;
import com.capstone.planbookai.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        
        // Lấy role ra (dạng String)
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse("ROLE_TEACHER");

        // Trả về response
        return ResponseEntity.ok(new JwtResponse(jwt,
                                                 userDetails.getId(), 
                                                 userDetails.getUsername(),
                                                 userDetails.getEmail(), 
                                                 List.of(role)));
    }

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Tạo user mới
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        
        // FIX: Lưu số điện thoại
        user.setPhone(signUpRequest.getPhone());
        
        // FIX: Set trạng thái mặc định để đăng nhập được ngay
        user.setStatus("ACTIVE");
        user.setEnabled(true);

        // Xử lý Role
        String strRole = signUpRequest.getRole();
        Role roleEnum = Role.ROLE_TEACHER; // Mặc định

        if (strRole != null && !strRole.isEmpty()) {
            try {
                // Chuẩn hóa input: "teacher" -> "ROLE_TEACHER", "ROLE_ADMIN" -> "ROLE_ADMIN"
                String roleName = strRole.toUpperCase();
                if (!roleName.startsWith("ROLE_")) {
                    roleName = "ROLE_" + roleName;
                }
                roleEnum = Role.valueOf(roleName);
            } catch (IllegalArgumentException e) {
                // Nếu lỗi thì fallback về Teacher
                roleEnum = Role.ROLE_TEACHER;
            }
        }
        
        user.setRole(roleEnum);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}