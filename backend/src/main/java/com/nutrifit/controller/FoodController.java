package com.nutrifit.controller;

import com.nutrifit.entity.Food;
import com.nutrifit.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/foods")
@CrossOrigin(origins = "http://localhost:5176")
public class FoodController {
    
    @Autowired
    private FoodService foodService;
    
    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }
    
    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        try {
            Food createdFood = foodService.createFood(food);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFood);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{foodId}")
    public ResponseEntity<Food> updateFood(@PathVariable Long foodId, @RequestBody Food foodDetails) {
        try {
            Food updatedFood = foodService.updateFood(foodId, foodDetails);
            return ResponseEntity.ok(updatedFood);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/{foodId}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long foodId) {
        foodService.deleteFood(foodId);
        return ResponseEntity.noContent().build();
    }
}
