package com.nutrifit.controller;

import com.nutrifit.dto.MealDto;
import com.nutrifit.entity.Meal;
import com.nutrifit.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/meals")
@CrossOrigin(origins = "http://localhost:5176")
public class MealController {
    
    @Autowired
    private MealService mealService;
    
    @GetMapping("/today")
    public ResponseEntity<List<MealDto>> getMealsForToday(@RequestParam Long userId) {
        List<Meal> meals = mealService.getMealsForToday(userId);
        List<MealDto> mealDtos = meals.stream()
                .map(this::convertToMealDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(mealDtos);
    }
    
    @GetMapping("/totals/today")
    public ResponseEntity<Map<String, Double>> getTotalsForToday(@RequestParam Long userId) {
        List<Meal> meals = mealService.getMealsForToday(userId);
        
        Map<String, Double> totals = Map.ofEntries(
            Map.entry("calories", meals.stream().mapToDouble(Meal::getCalories).sum()),
            Map.entry("protein", meals.stream().mapToDouble(Meal::getProtein).sum()),
            Map.entry("carbs", meals.stream().mapToDouble(Meal::getCarbs).sum()),
            Map.entry("fat", meals.stream().mapToDouble(Meal::getFat).sum()),
            Map.entry("iron", meals.stream().mapToDouble(Meal::getIron).sum()),
            Map.entry("calcium", meals.stream().mapToDouble(Meal::getCalcium).sum()),
            Map.entry("vitC", meals.stream().mapToDouble(Meal::getVitC).sum()),
            Map.entry("vitD", meals.stream().mapToDouble(Meal::getVitD).sum()),
            Map.entry("fiber", meals.stream().mapToDouble(Meal::getFiber).sum()),
            Map.entry("vitB12", meals.stream().mapToDouble(Meal::getVitB12).sum())
        );
        
        return ResponseEntity.ok(totals);
    }
    
    @PostMapping
    public ResponseEntity<MealDto> addMeal(@RequestParam Long userId, @RequestBody MealDto mealDto) {
        try {
            Meal meal = mealService.addMeal(userId, mealDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToMealDto(meal));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/{mealId}")
    public ResponseEntity<Void> removeMeal(@PathVariable Long mealId, @RequestParam Long userId) {
        try {
            mealService.removeMeal(mealId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    private MealDto convertToMealDto(Meal meal) {
        MealDto dto = new MealDto();
        dto.setId(meal.getId());
        dto.setName(meal.getName());
        dto.setMealTime(meal.getMealTime());
        dto.setCalories(meal.getCalories());
        dto.setProtein(meal.getProtein());
        dto.setCarbs(meal.getCarbs());
        dto.setFat(meal.getFat());
        dto.setIron(meal.getIron());
        dto.setCalcium(meal.getCalcium());
        dto.setVitC(meal.getVitC());
        dto.setVitD(meal.getVitD());
        dto.setFiber(meal.getFiber());
        dto.setVitB12(meal.getVitB12());
        dto.setConsumedOn(meal.getConsumedOn().toString());
        return dto;
    }
}
