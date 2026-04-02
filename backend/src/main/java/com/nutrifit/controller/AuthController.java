package com.nutrifit.controller;

import com.nutrifit.dto.AuthRequest;
import com.nutrifit.dto.AuthResponse;
import com.nutrifit.dto.UserDto;
import com.nutrifit.dto.DoctorDto;
import com.nutrifit.entity.User;
import com.nutrifit.entity.Doctor;
import com.nutrifit.service.AuthService;
import com.nutrifit.service.DoctorService;
import com.nutrifit.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5176")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest request,
                                                     @RequestParam(required = false) Integer age,
                                                     @RequestParam(required = false) String gender) {
        try {
            User user = authService.registerUser("", request.getEmail(), 
                                                 request.getPassword(), age, gender);
            
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(token, userDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest request) {
        try {
            User user = authService.loginUser(request.getEmail(), request.getPassword());
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
            
            return ResponseEntity.ok(new AuthResponse(token, userDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/doctor-register")
    public ResponseEntity<?> registerDoctor(@RequestBody AuthRequest request,
                                                       @RequestParam(required = false) String specialty,
                                                       @RequestParam(required = false) Integer experienceYears) {
        try {
            Doctor doctor = doctorService.registerDoctor("", request.getEmail(),
                                                        request.getPassword(), specialty, experienceYears);
            
            String token = jwtTokenProvider.generateToken(doctor.getId(), doctor.getEmail(), "DOCTOR");
            DoctorDto doctorDto = new DoctorDto(doctor.getId(), doctor.getName(), doctor.getEmail(),
                                               doctor.getSpecialty(), doctor.getExperienceYears(),
                                               doctor.getRating(), doctor.getTotalRatings(),
                                               doctor.getAvatar(), doctor.getAvailable());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(token, doctorDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/doctor-login")
    public ResponseEntity<?> loginDoctor(@RequestBody AuthRequest request) {
        try {
            Doctor doctor = doctorService.loginDoctor(request.getEmail(), request.getPassword());
            String token = jwtTokenProvider.generateToken(doctor.getId(), doctor.getEmail(), "DOCTOR");
            DoctorDto doctorDto = new DoctorDto(doctor.getId(), doctor.getName(), doctor.getEmail(),
                                               doctor.getSpecialty(), doctor.getExperienceYears(),
                                               doctor.getRating(), doctor.getTotalRatings(),
                                               doctor.getAvatar(), doctor.getAvailable());
            
            return ResponseEntity.ok(new AuthResponse(token, doctorDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
}
