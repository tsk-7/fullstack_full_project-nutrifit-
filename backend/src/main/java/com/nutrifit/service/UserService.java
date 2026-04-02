package com.nutrifit.service;

import com.nutrifit.entity.User;
import com.nutrifit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User updateUserProfile(Long id, String name, Integer age, String gender, 
                                  Double height, Double weight, String dateOfBirth) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        
        User user = userOpt.get();
        if (name != null) user.setName(name);
        if (age != null) user.setAge(age);
        if (gender != null) user.setGender(gender);
        if (height != null) user.setHeight(height);
        if (weight != null) user.setWeight(weight);
        if (dateOfBirth != null) user.setDateOfBirth(dateOfBirth);
        user.setProfileComplete(true);
        
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
