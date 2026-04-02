package com.nutrifit.service;

import com.nutrifit.entity.User;
import com.nutrifit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User registerUser(String name, String email, String password, Integer age, String gender) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User already exists with this email");
        }
        
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setAge(age);
        user.setGender(gender);
        user.setRole(User.UserRole.USER);
        user.setProfileComplete(false);
        
        return userRepository.save(user);
    }
    
    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        return user;
    }
}
