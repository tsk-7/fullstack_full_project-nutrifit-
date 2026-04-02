package com.nutrifit.controller;

import com.nutrifit.service.UserService;
import com.nutrifit.service.MealService;
import com.nutrifit.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5176")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private MealService mealService;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long totalUsers = userService.getAllUsers().stream()
                .filter(u -> u.getRole().toString().equals("USER"))
                .count();
        long totalMessages = messageRepository.count();
        
        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalMessages", totalMessages
        ));
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
