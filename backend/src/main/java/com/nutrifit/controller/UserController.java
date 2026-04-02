package com.nutrifit.controller;

import com.nutrifit.dto.UserDto;
import com.nutrifit.entity.User;
import com.nutrifit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5176")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestParam Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        User user = userOpt.get();
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setAge(user.getAge());
        userDto.setGender(user.getGender());
        userDto.setHeight(user.getHeight());
        userDto.setWeight(user.getWeight());
        userDto.setDateOfBirth(user.getDateOfBirth());
        userDto.setProfileComplete(user.getProfileComplete());
        userDto.setRole(user.getRole().toString());
        
        return ResponseEntity.ok(userDto);
    }
    
    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserDto> updateProfile(@PathVariable Long userId,
                                                 @RequestParam(required = false) String name,
                                                 @RequestParam(required = false) Integer age,
                                                 @RequestParam(required = false) String gender,
                                                 @RequestParam(required = false) Double height,
                                                 @RequestParam(required = false) Double weight,
                                                 @RequestParam(required = false) String dateOfBirth) {
        try {
            User user = userService.updateUserProfile(userId, name, age, gender, height, weight, dateOfBirth);
            
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setName(user.getName());
            userDto.setEmail(user.getEmail());
            userDto.setAge(user.getAge());
            userDto.setGender(user.getGender());
            userDto.setHeight(user.getHeight());
            userDto.setWeight(user.getWeight());
            userDto.setDateOfBirth(user.getDateOfBirth());
            userDto.setProfileComplete(user.getProfileComplete());
            userDto.setRole(user.getRole().toString());
            
            return ResponseEntity.ok(userDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
