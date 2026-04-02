package com.nutrifit.service;

import com.nutrifit.entity.Food;
import com.nutrifit.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FoodService {
    
    @Autowired
    private FoodRepository foodRepository;
    
    public List<Food> getAllFoods() {
        return foodRepository.findAllSorted();
    }
    
    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }
    
    public Food createFood(Food food) {
        if (food.getName() == null || food.getCalories() == null) {
            throw new IllegalArgumentException("Name and calories are required");
        }
        
        return foodRepository.save(food);
    }
    
    public Food updateFood(Long id, Food foodDetails) {
        Optional<Food> foodOpt = foodRepository.findById(id);
        
        if (foodOpt.isEmpty()) {
            throw new IllegalArgumentException("Food not found");
        }
        
        Food food = foodOpt.get();
        if (foodDetails.getName() != null) food.setName(foodDetails.getName());
        if (foodDetails.getCategory() != null) food.setCategory(foodDetails.getCategory());
        if (foodDetails.getCalories() != null) food.setCalories(foodDetails.getCalories());
        if (foodDetails.getProtein() != null) food.setProtein(foodDetails.getProtein());
        if (foodDetails.getCarbs() != null) food.setCarbs(foodDetails.getCarbs());
        if (foodDetails.getFat() != null) food.setFat(foodDetails.getFat());
        if (foodDetails.getIron() != null) food.setIron(foodDetails.getIron());
        if (foodDetails.getCalcium() != null) food.setCalcium(foodDetails.getCalcium());
        if (foodDetails.getVitC() != null) food.setVitC(foodDetails.getVitC());
        if (foodDetails.getVitD() != null) food.setVitD(foodDetails.getVitD());
        if (foodDetails.getFiber() != null) food.setFiber(foodDetails.getFiber());
        if (foodDetails.getVitB12() != null) food.setVitB12(foodDetails.getVitB12());
        
        return foodRepository.save(food);
    }
    
    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}
